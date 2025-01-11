import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashingService } from '@app/iam/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '@app/iam/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { randomUUID } from 'crypto';
import { InvalidatedRefreshTokenError } from '@app/iam/authentication/refresh-token-ids.storage/InvalidatedRefreshTokenError';
import { RefreshTokenIdsStorage } from '@app/iam/authentication/refresh-token-ids.storage/refresh-token-ids.storage';
import { Neo4jService } from '@app/neo4j';
import { FindQueryDto } from './dto/find-query.dto';
import { IActiveUserData } from '@app/iam/interfaces/active-user-data.interface';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly neo4jService: Neo4jService,
  ) { }

  public async login(userLogin: LoginUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email: userLogin.email },
    });

    if (!user) {
      throw new HttpException(
        `User with email ${userLogin.email} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid = await this.hashingService.compare(
      userLogin.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async register(userRegistration: RegisterUserDto) {
    const queryRunner =
      this.usersRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    const neo4jSession = this.neo4jService.getWriteSession();
    const neo4jTransaction = neo4jSession.beginTransaction();

    try {
      // Check if user already exists (email is already registered):
      const existingUser = await this.usersRepository.findOne({
        where: { email: userRegistration.email },
      });

      if (existingUser) {
        throw new HttpException(
          `User with email ${userRegistration.email} already exists`,
          HttpStatus.CONFLICT,
        );
      }

      const userDto = {
        ...userRegistration,
        password: await this.hashingService.hash(userRegistration.password),
      };
      const newUser = this.usersRepository.create(userDto);
      const { password, role, ...response } =
        await queryRunner.manager.save(newUser);

      // Add user to Neo4j
      const cypher = `
      MERGE (u:User {id: $userId})
      ON CREATE SET u.name = $userName, u.surnames = $userSurnames
        `;
      const params = {
        userId: response.id,
        userName: response.name,
        userSurnames: response.surnames,
      };
      await neo4jTransaction.run(cypher, params);

      // Commit both transactions
      await queryRunner.commitTransaction();
      await neo4jTransaction.commit();

      return response;
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

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<IActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.usersRepository.findOneOrFail({
        where: { id: sub },
      });
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }
      const tokens = await this.generateTokens(user);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError)
        throw new UnauthorizedException('Refresh token has expired');
      throw new UnauthorizedException();
    }
  }

  async findOne(id: string) {
    const user = await this.getUserById(id);

    const {
      email,
      password,
      birthdate,
      role,
      googleId,
      githubId,
      history,
      isEmailPublic,
      isBirthdatePublic,
      ...response
    } = user;

    const emailResponse = user.isEmailPublic ? user.email : null;
    const birthdateResponse = user.isBirthdatePublic ? user.birthdate : null;

    return {
      email: emailResponse,
      birthdate: birthdateResponse,
      ...response,
    };
  }

  async getProfile(userId: string) {
    const { password, role, googleId, githubId, history, ...response } =
      await this.getUserById(userId);
    return response;
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const queryRunner =
      this.usersRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    const neo4jSession = this.neo4jService.getWriteSession();
    const neo4jTransaction = neo4jSession.beginTransaction();

    try {
      // Verify user exists
      const user = await this.getUserById(id);

      // Remove user from PostgreSQL
      await queryRunner.manager.remove(User, user);

      // Remove user and relationships from Neo4j
      const cypher = `
        MATCH (u:User {id: $userId})
        DETACH DELETE u
      `;
      const params = { userId: id };
      await neo4jTransaction.run(cypher, params);

      // Commit both transactions
      await queryRunner.commitTransaction();
      await neo4jTransaction.commit();
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

  async followUser(userId: string, followedId: string) {
    // Verify followedId exists:
    if (await this.getUserById(followedId)) {
      // Add relationship in Neo4j
      this.neo4jService.write(
        `
      MATCH (u:User {id: $userId})
      MATCH (f:User {id: $followedId})
      MERGE (u)-[:FOLLOWS]->(f)
    `,
        { userId, followedId },
      );
    } else {
      throw new HttpException(
        `User #${followedId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async find(query: FindQueryDto, activeUserId: string) {
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
    return result.records.map((record) => ({
      name: record.get('name'),
      surnames: record.get('surnames'),
      id: record.get('id'),
    }));
  }

  public async addUserToCommunity(
    userId: string,
    idCommunity: string,
  ): Promise<void> {
    const cypher = `
    MERGE (u:User {id: $userId})
    MERGE (c:Community {id: $idCommunity})
    MERGE (u)-[:IS_MEMBER_OF]->(c)
  `;
    const params = { userId, idCommunity };
    await this.neo4jService.write(cypher, params);
  }

  async getFullUserInfo(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['history'], // Requests cascading the whole relation objects of the user.
    });

    if (!user) {
      throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<IActiveUserData>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }

  private async getUserById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
