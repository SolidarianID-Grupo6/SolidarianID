import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../../users.module';
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
