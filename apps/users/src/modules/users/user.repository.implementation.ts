import { InjectRepository } from '@nestjs/typeorm';
import * as Domain from './domain';
import * as Persistence from './persistence';
import { Repository } from 'typeorm';
import { UserMapper } from './user.mapper';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepo } from './user.repository';
import { Either, left, right } from 'libs/base/logic/Result';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import { UpdateUserDto } from './dto/update-user.dto';
import { Neo4jService } from '@app/neo4j';
import { UnknownError } from '../../errors/UnknownError';
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError';
import { RefreshTokenIdsStorage } from '@app/iam/authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { RefreshTokenNotValidError } from '../../errors/RefreshTokenNotValidError';
import { FindQueryDto } from './dto/find-query.dto';

@Injectable()
export class UsersRepoImpl implements UsersRepo {
  constructor(
    @InjectRepository(Persistence.User)
    private readonly usersRepo: Repository<Persistence.User>,
    private readonly neo4jService: Neo4jService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) { }
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
      const persistenceUser = this.usersRepo.create(
        UserMapper.toPersistence(user),
      );

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

  public async validateRefreshToken(
    userId: string,
    refreshTokenId: string,
  ): Promise<Either<UserNotFoundError | RefreshTokenNotValidError, Domain.User>> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      return left(new UserNotFoundError());
    }

    const isValid = await this.refreshTokenIdsStorage.validate(userId, refreshTokenId);
    if (!isValid) {
      return left(new RefreshTokenNotValidError());
    }

    await this.refreshTokenIdsStorage.invalidate(userId);

    return right(UserMapper.toDomain(user));
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

  async updateUser(userId: string, updateUser: UpdateUserDto): Promise<Either<UserNotFoundError, Domain.User>> {
    const existingUser = await this.usersRepo.findOne({ where: { id: userId } });

    if (!existingUser) {
      return left(new UserNotFoundError());
    }

    const updatedUserData = {
      ...existingUser,
      ...updateUser,
    };

    const savedUser = await this.usersRepo.save(updatedUserData);

    return right(UserMapper.toDomain(savedUser));
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

  async removeUser(userId: string): Promise<Either<UserNotFoundError, void>> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user) {
      return left(new UserNotFoundError());
    }

    const queryRunner = this.usersRepo.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    const neo4jSession = this.neo4jService.getWriteSession();
    const neo4jTransaction = neo4jSession.beginTransaction();

    try {
      // Remove user from PostgreSQL
      await queryRunner.manager.remove(Persistence.User, user);

      // Remove user and relationships from Neo4j
      const cypher = `
        MATCH (u:User {id: $userId})
        DETACH DELETE u
      `;
      const params = { userId: userId };
      await neo4jTransaction.run(cypher, params);

      // Commit both transactions
      await queryRunner.commitTransaction();
      await neo4jTransaction.commit();

      return right(undefined);
    } catch (error) {
      // Rollback both transactions
      await queryRunner.rollbackTransaction();
      await neo4jTransaction.rollback();
      throw error;
    } finally {
      // Release resources
      await queryRunner.release();
      await neo4jSession.close();
    }
  }

  public async saveNewToken(userId: string, refreshTokenId: string): Promise<void> {
    await this.refreshTokenIdsStorage.insert(userId, refreshTokenId);
  }

  public async findUsers(query: FindQueryDto, activeUserId: string): Promise<Domain.User[]> {
    const {
      userQuery,
      communityQuery,
      friendshipDepth,
      limit = 10,
      offset = 0,
    } = query;

    let userMatch = '';
    let communityMatch = '';
    let relationshipMatch = '';

    if (userQuery) {
      userMatch = `
      (u:User)
      WHERE toLower(u.id) CONTAINS toLower($userQuery) OR toLower(u.name) CONTAINS toLower($userQuery) OR toLower(u.surnames) CONTAINS toLower($userQuery)
    `;
    } else {
      userMatch = '(u:User)';
    }

    if (communityQuery) {
      communityMatch = `
      (c:Community)
      WHERE toLower(c.id) CONTAINS toLower($communityQuery) OR toLower(c.name) CONTAINS toLower($communityQuery)
        `;
    }

    if (friendshipDepth > 0) {
      relationshipMatch = `
      OPTIONAL MATCH (a:User {id: $activeUserId})-[:FOLLOWS*0..${friendshipDepth}]->(u)
        `;
    }

    const cypher = `
    MATCH ${userMatch ?? '(u:User)'}
    ${communityMatch ? `MATCH ${communityMatch}` : ''}
    ${relationshipMatch}
    RETURN DISTINCT u.name AS name, u.surnames AS surnames, u.id AS id
    SKIP toInteger($offset)
    LIMIT toInteger($limit)
  `;

    const params = { userQuery, communityQuery, offset, limit };

    const result = await this.neo4jService.read(cypher, params);
    return result.records.map((record) => {
      const user = new Persistence.User();
      user.id = record.get('id');
      user.name = record.get('name');
      user.surnames = record.get('surnames');
      return UserMapper.toDomain(user);
    });
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
