import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../../users/users.module';
import { IamModule } from '@app/iam';
import { GithubOauthService } from './github.oauth.service';
import { GithubOauthController } from './github.oauth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    forwardRef(() => UsersModule),
    IamModule,
  ],
  controllers: [GithubOauthController],
  providers: [GithubOauthService],
})
export class GithubOauthModule {}
