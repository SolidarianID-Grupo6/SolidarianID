import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from '@app/iam';
import { GithubOauthService } from './github.oauth.service';
import { GithubOauthController } from './github.oauth.controller';
import { User } from '../../users/persistence/user.entity';
import { UsersModule } from '../../users/users.module';

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
