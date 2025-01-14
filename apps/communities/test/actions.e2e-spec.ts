// actions.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { ActionModule } from '../src/action/action.module';

describe('ActionController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ActionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/actions (POST) should create a food action', async () => {
    const newAction = {
      title: 'Distribución de Leche',
      description: 'Recolectar y distribuir leche para comunidades vulnerables.',
      cause: '677ee39918263ddcbcbfc890',
      type: 'food',
      foodType: 'leche',
      foodGoalQuantity: 1000,
    };
    const response = await request(app.getHttpServer())
      .post('/actions')
      .send(newAction)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toEqual(newAction.title);
  });

  it('/actions (GET) should return all actions', async () => {
    const response = await request(app.getHttpServer())
      .get('/actions')
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/actions/:id (GET) should return a single action', async () => {
    const actionId = '677aa5d032ad0a3ca5768ed1';
    const response = await request(app.getHttpServer())
      .get(`/actions/${actionId}`)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('id', actionId);
  });

  it('/actions/:id (PUT) should update an action', async () => {
    const actionId = 'test-id'; // Replace with a valid ID if needed.
    const updatedData = { title: 'Updated Action' };

    await request(app.getHttpServer())
      .put(`/actions/${actionId}`)
      .send(updatedData)
      .expect(HttpStatus.OK);
  });

  it('/actions/:id/donate (POST) should donate to a money action', async () => {
    const actionId = '677aa5e532ad0a3ca5768ed3';
    const donationData = { user: 'skfjh3', donation: 300 };

    const response = await request(app.getHttpServer())
      .post(`/actions/${actionId}/donate`)
      .send(donationData)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('donation', donationData.donation);
  });

  it('/actions/:id/volunteer (POST) should register a volunteer', async () => {
    const actionId = '677ef5c5bf15ce4d091cfc14';
    const volunteerData = { user: 'ttrwa' };

    await request(app.getHttpServer())
      .post(`/actions/${actionId}/volunteer`)
      .send(volunteerData)
      .expect(HttpStatus.CREATED);
  });

  it('/actions/:id (DELETE) should delete an action', async () => {
    const actionId = '677aa6bd32ad0a3ca5768ed5';

    await request(app.getHttpServer())
      .delete(`/actions/${actionId}`)
      .expect(HttpStatus.OK);
  });
});
