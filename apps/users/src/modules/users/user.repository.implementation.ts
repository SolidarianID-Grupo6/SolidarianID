import { InjectRepository } from '@nestjs/typeorm';
import * as Domain from './domain';
import * as Persistence from './persistence';
import { Repository } from 'typeorm';
import { UserMapper } from './user.mapper';
import { Injectable } from '@nestjs/common';
import { RepoUsers } from './user.repository';

@Injectable()
export class UsersRepoImpl /*implements RepoUsers*/ {
  // constructor(
  //   @InjectRepository(Persistence.User)
  //   private repo: Repository<Persistence.User>,
  // ) {}

  // findById(id: string): Promise<Domain.User> {
  //   return this.repo
  //     .findOneBy({ id: Number(id) })
  //     .then((user) => UserMapper.toDomain(user));
  // }

  // findByFirstName(firstName: string): Promise<Domain.User> {
  //   return this.repo
  //     .findOne({
  //       where: { firstName },
  //     })
  //     .then((user) => UserMapper.toDomain(user));
  // }

  // async save(entity: Domain.User): Promise<void> {
  //   await this.repo.save(UserMapper.toPersistence(entity));
  // }

  // async delete(id: string): Promise<void> {
  //   await this.repo.delete(id);
  // }

  // findAllUsers(): Promise<Domain.User[]> {
  //   return this.repo
  //     .find()
  //     .then((users) => users.map((user) => UserMapper.toDomain(user)));
  // }
}
