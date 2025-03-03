import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HistoryModule } from '../history/history.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './persistence/user.entity';
import { History } from '../history/entities/history.entity';
import { IamModule } from '@app/iam';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GoogleOauthModule } from '../oauth/google.oauth/google.oauth.module';
import jwtConfig from '@app/iam/config/jwt.config';
import { GithubOauthModule } from '../oauth/github.oauth/github.oauth.module';
import { Neo4jModule } from '@app/neo4j';
import { Neo4jConfig } from '@app/neo4j/interfaces/neo4j-config.interface';
import { UsersServiceImpl } from './users.service.implementation';

@Module({
  imports: [
    HistoryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_SOLIDARIANID_USERS_DB,
      autoLoadEntities: true, // models will be loaded automatically (you don't have to explicitly define the entities: [] array)
      synchronize: true, // your entities will be synced with the database (careful with that in production - set it to false)
    }),
    TypeOrmModule.forFeature([User, History]),
    IamModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    forwardRef(() => GoogleOauthModule),
    forwardRef(() => GithubOauthModule),
    GithubOauthModule,
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Neo4jConfig => ({
        scheme: configService.get('NEO4J_SCHEME'),
        host: configService.get('NEO4J_HOST'),
        port: configService.get('NEO4J_PORT'),
        username: configService.get('NEO4J_USERNAME'),
        password: configService.get('NEO4J_PASSWORD'),
        database: configService.get('NEO4J_USERS_DATABASE'),
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [
    {
      useClass: UsersService,
      provide: UsersServiceImpl,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
