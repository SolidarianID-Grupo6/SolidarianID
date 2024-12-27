import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HistoryModule } from './history/history.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { History } from './history/entities/history.entity';
import { IamModule } from '@app/iam';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '@app/iam/config/jwt.config';

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
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
