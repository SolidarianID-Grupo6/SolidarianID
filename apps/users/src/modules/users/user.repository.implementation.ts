import { InjectRepository } from '@nestjs/typeorm';
import * as Domain from './domain';
import * as Persistence from './persistence';
import { Repository } from 'typeorm';
import { UserMapper } from './user.mapper';
import { Injectable } from '@nestjs/common';
import { UsersRepo } from './user.repository';
import { Either, left, right } from 'libs/base/logic/Result';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import { Neo4jService } from '@app/neo4j';

@Injectable()
export class UsersRepoImpl implements UsersRepo {
  constructor(
    @InjectRepository(Persistence.User)
    private readonly usersRepo: Repository<Persistence.User>,
    private readonly neo4jService: Neo4jService,
  ) {}
  findByFirstName(firstName: string): Promise<Domain.User> {
    throw new Error('Method not implemented.');
  }
  findAllUsers(): Promise<Domain.User[]> {
    throw new Error('Method not implemented.');
  }
  exists(t: Domain.User): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  save(t: Domain.User): Promise<Domain.User> {
    throw new Error('Method not implemented.');
  }

  async findByEmail(
    email: string,
  ): Promise<Either<UserNotFoundError, Domain.User>> {
    const user = await this.usersRepo.findOneBy({ email: email });
    if (!user) {
      return left(new UserNotFoundError());
    }

    return right(UserMapper.toDomain(user));
  }

  async findById(userId: string): Promise<Either<UserNotFoundError, Domain.User>> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user) {
      return left(new UserNotFoundError());
    }

    return right(UserMapper.toDomain(user));
  }

  async followUser(userId: string, followedId: string): Promise<Either<UserNotFoundError, void>> {
    const user = await this.usersRepo.findOne({ where: { id: followedId } });

    if (!user) {
      return left(new UserNotFoundError());
    }

    await this.neo4jService.write(
      `
      MATCH (u:User {id: $userId})
      MATCH (f:User {id: $followedId})
      MERGE (u)-[:FOLLOWS]->(f)
    `,
      { userId, followedId },
    );

    return right(undefined);
  }

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
