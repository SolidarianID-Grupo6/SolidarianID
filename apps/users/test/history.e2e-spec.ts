import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { HistoryModule } from '../src/history/history.module';
import { User } from '../src/entities/user.entity';
import { History } from '../src/history/entities/history.entity';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { IamModule } from '@app/iam';
import { UsersModule } from '../src/users.module';
import { Role } from '@app/iam/authorization/enums/role.enum';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import { ODS_ENUM } from 'libs/enums/ods.enum';
import { HashingService } from '@app/iam/hashing/hashing.service';

describe('History (e2e)', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let userRepo: Repository<User>;
  let historyRepo: Repository<History>;
  let adminUser: User;
  let regularUser: User;
  let adminToken: string;
  let regularToken: string;
  let hashingService: HashingService;
  let natsClient: ClientProxy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // Import the module to test
        HistoryModule,
        // Real DB (adjust config for local or test DB)
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST || 'localhost',
          port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_SOLIDARIANID_USERS_DB,
          entities: [User, History],
          synchronize: true,
        }),
        // Microservice client
        ClientsModule.register([
          {
            name: 'USERS_SERVICE',
            transport: Transport.TCP,
            options: { host: '127.0.0.1', port: 3002 },
          },
        ]),
        ClientsModule.register([
          {
            name: 'NATS_SERVICE',
            transport: Transport.NATS,
            options: {
              servers: [process.env.NATS_URL || 'nats://localhost:4222'],
            },
          },
        ]),
        IamModule,
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    client = app.get('USERS_SERVICE');
    await app.startAllMicroservices();
    await app.init();

    userRepo = app.get('UserRepository');
    historyRepo = app.get('HistoryRepository');
    natsClient = app.get('NATS_SERVICE');
    hashingService = moduleFixture.get<HashingService>(HashingService);

    adminUser = await userRepo.save({
      name: 'Admin',
      surnames: 'Admin',
      email: 'admin@solidarianid.com',
      password: await hashingService.hash('admin'),
      birthdate: new Date(),
      role: Role.Admin,
    });

    regularUser = await userRepo.save({
      name: 'John',
      surnames: 'Doe',
      email: 'jon.doe@solidarianid.com',
      password: await hashingService.hash('securePassword123'),
      birthdate: new Date(),
    });

    // Obtain the admin and regular user token from calling POST /login, the token is in the set-cookie header:
    adminToken = await request(app.getHttpServer())
      .post('')
      .send({ email: 'admin@solidarianid.com', password: 'admin' })
      .expect(HttpStatus.OK)
      .then((response) => response.headers['set-cookie'][0]);

    regularToken = await request(app.getHttpServer())
      .post('')
      .send({
        email: 'jon.doe@solidarianid.com',
        password: 'securePassword123',
      })
      .expect(HttpStatus.OK)
      .then((response) => response.headers['set-cookie'][0]);
  });

  afterEach(async () => {
    await historyRepo.query('DELETE FROM history');
  });

  afterAll(async () => {
    await userRepo.query('DELETE FROM users');
    await app.close();
  });

  describe('REST Endpoints', () => {
    it('GET /history should return empty array when no records exist', () => {
      return request(app.getHttpServer())
        .get('/history')
        .set('Cookie', regularToken)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('GET /history/:id should require admin role', () => {
      return request(app.getHttpServer())
        .get('/history/123')
        .set('Cookie', regularToken)
        .expect(403);
    });

    it('GET /history/:id should return user history for admin', () => {
      return request(app.getHttpServer())
        .get(`/history/${regularUser.id}`)
        .set('Cookie', adminToken)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('POST /history should create a new history record', async () => {
      const eventPayload = {
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        user: regularUser.id,
        name: 'Test Community',
        causes: [
          {
            cause_id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Test Cause',
            ods: [ODS_ENUM.ACCION_POR_EL_CLIMA],
            userId: regularUser.id,
          },
        ],
      };

      await lastValueFrom(
        natsClient.emit(CommunityEvent.CreateCommunity, eventPayload),
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await request(app.getHttpServer())
        .get(`/history/${regularUser.id}?limit=1&offset=0`)
        .set('Cookie', adminToken)
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].action).toBe(CommunityEvent.CreateCommunity);
      expect(response.body[0].data).toMatchObject(eventPayload);
    });
  });

  describe('Event Handlers', () => {
    const testCases = [
      {
        event: CommunityEvent.CreateCommunity,
        payload: {
          community_id: '123e4567-e89b-12d3-a456-426614174000',
          user: 'USER_ID',
          name: 'Test Community',
          causes: [
            {
              cause_id: '123e4567-e89b-12d3-a456-426614174000',
              title: 'Test Cause',
              ods: [ODS_ENUM.ACCION_POR_EL_CLIMA],
              userId: 'USER_ID',
            },
          ],
        },
        method: 'registerCommunityCreation',
      },
      {
        event: CommunityEvent.NewCommunityUser,
        payload: {
          userId: 'USER_ID',
          communityId: '123e4567-e89b-12d3-a456-426614174000',
        },
        method: 'registerCommunityMembership',
      },
      {
        event: CommunityEvent.CreateCause,
        payload: {
          communityId: '123e4567-e89b-12d3-a456-426614174000',
          cause_id: '123e4567-e89b-12d3-a456-426614174000',
          userId: 'USER_ID',
          title: 'Test Cause',
          ods: [ODS_ENUM.ACCION_POR_EL_CLIMA],
        },
        method: 'registerCauseCreation',
      },
      {
        event: CommunityEvent.CreateAction,
        payload: {
          actionId: '123e4567-e89b-12d3-a456-426614174000',
          cause_id: '123e4567-e89b-12d3-a456-426614174000',
          user: 'USER_ID',
          title: 'Test Action',
          description: 'Test Description',
          goal: 100,
        },
        method: 'registerActionCreation',
      },
      {
        event: CommunityEvent.DonateEvent,
        payload: {
          actionId: '123e4567-e89b-12d3-a456-426614174000',
          causeId: '123e4567-e89b-12d3-a456-426614174000',
          user: 'USER_ID',
          type: 'money',
          progress: 50,
        },
        method: 'registerDonation',
      },
    ];

    testCases.forEach(({ event, payload, method }) => {
      it(`should handle ${event} event`, async () => {
        // Replace USER_ID with actual user id
        const actualPayload = JSON.parse(
          JSON.stringify(payload).replace(/USER_ID/g, regularUser.id),
        );

        await lastValueFrom(natsClient.emit(event, actualPayload));

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const records = await historyRepo.find({
          relations: ['user'],
          where: { action: event },
        });

        expect(records).toHaveLength(1);
        expect(records[0].action).toBe(event);
        expect(records[0].user.id).toBe(regularUser.id);
        expect(records[0].data).toMatchObject(actualPayload);
      });
    });

    it('should handle multiple events in order', async () => {
      const events = testCases.slice(0, 2);

      for (const { event, payload } of events) {
        const actualPayload = JSON.parse(
          JSON.stringify(payload).replace(/USER_ID/g, regularUser.id),
        );

        await lastValueFrom(natsClient.emit(event, actualPayload));
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const records = await historyRepo.find({
        relations: ['user'],
        order: { eventDate: 'ASC' },
      });

      expect(records).toHaveLength(events.length);
      expect(records.map((r) => r.action)).toEqual(events.map((e) => e.event));
    });
  });
});
