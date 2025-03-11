import { InjectRepository } from '@nestjs/typeorm';
import * as Domain from './domain';
import * as Persistence from './persistence';
import { Repository } from 'typeorm';
import { UserMapper } from './user.mapper';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepo } from './user.repository';
import { Either, left, right } from 'libs/base/logic/Result';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import { Neo4jService } from '@app/neo4j';
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError';
import { UnknownError } from '../../errors/UnknownError';

@Injectable()
export class UsersRepoImpl implements UsersRepo {
  constructor(
    @InjectRepository(Persistence.User)
    private readonly usersRepo: Repository<Persistence.User>,
    private readonly neo4jService: Neo4jService,
  ) {}
  save(t: Domain.User): Promise<Domain.User> {
    throw new Error('Method not implemented.');
  }
  findByFirstName(firstName: string): Promise<Domain.User> {
    throw new Error('Method not implemented.');
  }
  findAllUsers(): Promise<Domain.User[]> {
    throw new Error('Method not implemented.');
  }
  exists(t: Domain.User): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  public async saveUser(
    user: Domain.User,
  ): Promise<Either<UserAlreadyExistsError | UnknownError, Domain.User>> {

    const existingUser = await this.usersRepo.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      return left(new UserAlreadyExistsError());
    }

    const queryRunner = this.usersRepo.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    const neo4jSession = this.neo4jService.getWriteSession();
    const neo4jTransaction = neo4jSession.beginTransaction();

    try {
      const persistenceUser = this.usersRepo.create(UserMapper.toPersistence(user);

      const createdUser = await queryRunner.manager.save(persistenceUser);
      
      // Add user to Neo4j
      const cypher = `
        MERGE (u:User {id: $userId})
        ON CREATE SET u.name = $userName, u.surnames = $userSurnames
          `;
      const params = {
        userId: createdUser.id,
        userName: createdUser.name,
        userSurnames: createdUser.surnames,
      };
      await neo4jTransaction.run(cypher, params);

      // Commit both transactions
      await queryRunner.commitTransaction();
      await neo4jTransaction.commit();

      return right(UserMapper.toDomain(createdUser));
    } catch (error) {
      // Rollback both transactions
      await queryRunner.rollbackTransaction();
      await neo4jTransaction.rollback();
      
      return left(new UnknownError);
    } finally {
      // Release resources
      await queryRunner.release();
      await neo4jSession.close();
    }
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
