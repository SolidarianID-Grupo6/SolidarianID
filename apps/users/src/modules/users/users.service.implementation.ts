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
import { User } from './persistence/user.entity';
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
import { Role } from '@app/iam/authorization/enums/role.enum';
import { UsersService } from './users.service';
import { UsersRepo } from './user.repository';
import { Either, left, Result, right } from 'libs/base/logic/Result';
import * as Domain from './domain';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import { LoginUserDtoResponse as LoginUserDtoResponse } from './dto/login-user.dto.response';
import { AuthenticationError } from '../../errors/AuthenticationError';
import { UserMapper } from './user.mapper';
import { UniqueEntityID } from 'libs/base/domain/UniqueEntityID';
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError';
import { RegisterUserDtoResponse } from './dto/register-user.dto.response';

@Injectable()
export class UsersServiceImpl implements UsersService {
  public constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepo,
    // TODO : Remove this when the repository is replaced.
    @InjectRepository(User)
    private readonly oldUsersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly neo4jService: Neo4jService,
  ) { }

  public async login(
    userLogin: LoginUserDto,
  ): Promise<Either<AuthenticationError, LoginUserDtoResponse>> {
    const userResult = await this.usersRepository.findByEmail(userLogin.email);

    if (userResult.isLeft()) {
      return left(new AuthenticationError());
    }

    const user = userResult.value;

    const isPasswordValid = await this.hashingService.compare(
      userLogin.password,
      user.password,
    );

    if (!isPasswordValid) {
      return left(new AuthenticationError());
    }

    const tokens = await this.generateTokens(user);

    return right(tokens);
  }

  public async register(
    userRegistration: RegisterUserDto,
  ): Promise<Either<UserAlreadyExistsError, RegisterUserDtoResponse>> {
    const hashedPassword = await this.hashingService.hash(
      userRegistration.password,
    );
    const user = Domain.User.create({
      id: new UniqueEntityID(),
      name: userRegistration.name,
      surnames: userRegistration.surnames,
      email: userRegistration.email,
      isEmailPublic: userRegistration.isEmailPublic,
      password: hashedPassword,
      birthdate: userRegistration.birthdate,
      isBirthdatePublic: userRegistration.isBirthdatePublic,
      presentation: userRegistration.presentation || '',
      role: Role.Registered,
      googleId: '',
      githubId: '',
      history: [],
    });

    const resultOrError = await this.usersRepository.saveUser(user);

    if (resultOrError.isLeft()) {
      return left(resultOrError.value);
    }

    const dtoResponse = RegisterUserDtoResponse.fromDomain(resultOrError.value);

    return right(dtoResponse);
  }

  public async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<Either<AuthenticationError, LoginUserDtoResponse>> {
    const decodedTokenOrError = await this.validateAndDecodeRefreshToken(refreshTokenDto.refreshToken);
    if (decodedTokenOrError.isLeft()) {
      return left(new AuthenticationError());
    }
    const { sub: userId, refreshTokenId } = decodedTokenOrError.value;
  
    const userOrError = await this.usersRepository.validateRefreshToken(userId, refreshTokenId);
    if (userOrError.isLeft()) {
      return left(userOrError.value); 
    }
    const user = userOrError.value;
  
    const tokens = await this.generateTokens(user);
  
    return right(tokens);
  }

  async findOne(id: string): Promise<Either<UserNotFoundError, Domain.User>> {
    const userResult = await this.getUserById(id);


    if (userResult.isLeft()) {
      return left(userResult.value);
    }

    const user = userResult.value;

    const modifiedUser = Domain.User.create({
      ...user.props,
      email: user.isEmailPublic ? user.email : null,
      birthdate: user.isBirthdatePublic ? user.birthdate : null
    });

    return right(modifiedUser);

  }

  public async getProfile(userId: string): Promise<Either<UserNotFoundError, Domain.User>> {
    return this.getUserById(userId);
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<Either<UserNotFoundError, Domain.User>> {
    const userResult = await this.getUserById(id);

    if (userResult.isLeft()) {
      return left(userResult.value);
    }

    const existingUser = userResult.value;

    const updatedUser = Domain.User.create({
      ...existingUser.props,
      name: updateUserDto.name ?? existingUser.name,
      surnames: updateUserDto.surnames ?? existingUser.surnames,
      email: updateUserDto.email ?? existingUser.email,
      isEmailPublic: updateUserDto.isEmailPublic ?? existingUser.isEmailPublic,
      birthdate: updateUserDto.birthdate ?? existingUser.birthdate,
      isBirthdatePublic: updateUserDto.isBirthdatePublic ?? existingUser.isBirthdatePublic,
      presentation: updateUserDto.presentation ?? existingUser.presentation,
    });

    // Guardamos el usuario actualizado usando el repositorio de dominio
    const saveResult = await this.usersRepository.updateUser(id, updatedUser);

    if (saveResult.isLeft()) {
      return left(saveResult.value);
    }

    return right(saveResult.value);
  }

  // public async remove(id: string): Promise<Either<UserNotFoundError, void>> {
  //   const queryRunner =
  //     this.oldUsersRepository.manager.connection.createQueryRunner();
  //   await queryRunner.startTransaction();

  //   const neo4jSession = this.neo4jService.getWriteSession();
  //   const neo4jTransaction = neo4jSession.beginTransaction();

  //   try {
  //     // Verify user exists
  //     const user = await this.getUserById(id);

  //     // Remove user from PostgreSQL
  //     await queryRunner.manager.remove(User, user);

  //     // Remove user and relationships from Neo4j
  //     const cypher = `
  //       MATCH (u:User {id: $userId})
  //       DETACH DELETE u
  //     `;
  //     const params = { userId: id };
  //     await neo4jTransaction.run(cypher, params);

  //     // Commit both transactions
  //     await queryRunner.commitTransaction();
  //     await neo4jTransaction.commit();
  //   } catch (error) {
  //     // Rollback both transactions
  //     await queryRunner.rollbackTransaction();
  //     await neo4jTransaction.rollback();
  //     throw error;
  //   } finally {
  //     // Release resources
  //     await queryRunner.release();
  //     await neo4jSession.close();
  //   }
  // }

  public async remove(id: string): Promise<Either<UserNotFoundError, void>> {
    return this.usersRepository.removeUser(id);
  }

  public async followUser(userId: string, followedId: string): Promise<Either<UserNotFoundError, void>> {
    return this.usersRepository.followUser(userId, followedId);
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
    const user = await this.oldUsersRepository.findOne({
      where: { id },
      relations: ['history'], // Requests cascading the whole relation objects of the user.
    });

    if (!user) {
      throw new HttpException(`User #${id} not found`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async generateTokens(
    user: Domain.User,
  ): Promise<LoginUserDtoResponse> {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<IActiveUserData>(
        user.id.toString(),
        this.jwtConfiguration.accessTokenTtl,
        {
          sub: user.id.toString(),
          email: user.email,
          role: user.role,
        },
      ),
      this.signToken(
        user.id.toString(),
        this.jwtConfiguration.refreshTokenTtl,
        {
          refreshTokenId,
        },
      ),
    ]);
    await this.usersRepository.saveNewToken(
      user.id.toString(),
      refreshTokenId,
    );
    return { accessToken, refreshToken };
  }

  /*
  public async makeUserAdmin(userId: string): Promise<Either<UserNotFoundError, { userId: string; role: Role }>> {
    const userResult = await this.usersRepository.findById(userId);
  
    if (userResult.isLeft()) {
      return left(new UserNotFoundError(`User #${userId} not found`));
    }
  
    const user = userResult.value;

 // Crear un nuevo objeto con todas las propiedades requeridas
 const updatedUser: User = {
  ...user, // Copy all existing properties
  id: user.id.toString(), // Ensure required properties are explicitly included
  name: user.name,
  surnames: user.surnames,
  email: user.email,
  password: user.password,
  birthdate: user.birthdate,
  isEmailPublic: user.isEmailPublic,
  isBirthdatePublic: user.isBirthdatePublic,
  presentation: user.presentation,
  googleId: user.googleId,
  githubId: user.githubId,
  history: user.history,
  role: Role.Admin, // Update the role
};

// Guardar el usuario actualizado en el repositorio
const domainUser = UserMapper.toDomain(updatedUser);
await this.usersRepository.save(domainUser);

// Invalidar los tokens antiguos
await this.refreshTokenIdsStorage.invalidate(user.id);

// Retornar el resultado exitoso
return right({ userId: user.id, role: updatedUser.role });
}

*/

public async makeUserAdmin(userId: string): Promise<Either<UserNotFoundError, { userId: string; role: Role }>> {
  const userResult = await this.usersRepository.findById(userId);

  if (userResult.isLeft()) {
    return left(new UserNotFoundError(`User #${userId} not found`));
  }

  const user = userResult.value;

  // Crear un nuevo objeto con todas las propiedades requeridas
 /*  const updatedUser: User = {
    ...user, // Copy all existing properties
    id: user.id.toString(), // Ensure required properties are explicitly included
   name: user.name,
    surnames: user.surnames,
    email: user.email,
    password: user.password,
    birthdate: user.birthdate,
    isEmailPublic: user.isEmailPublic,
    isBirthdatePublic: user.isBirthdatePublic,
    presentation: user.presentation,
    googleId: user.googleId,
    githubId: user.githubId,
    history: user.history,
    
    role: Role.Admin, // Update the role
  };
*/

user.role = Role.Admin;

  // Guardar el usuario actualizado en el repositorio
 
  await this.usersRepository.save(user);

  // Invalidar los tokens antiguos
  await this.refreshTokenIdsStorage.invalidate(user.id.toString());

  // Retornar el resultado exitoso
  return right({ userId: user.id.toString(), role: user.role });

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

  private async getUserById(id: string): Promise<Either<UserNotFoundError, Domain.User>> {
    const userResult = await this.usersRepository.findById(id);

    if (userResult.isLeft()) {
      return left(new UserNotFoundError(id));
    }

    return right(userResult.value);
  }

  private async validateAndDecodeRefreshToken(
    refreshToken: string,
  ): Promise<Either<AuthenticationError, { sub: string; refreshTokenId: string }>> {
    try {
      const decoded = await this.jwtService.verifyAsync<
        Pick<IActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      return right(decoded);
    } catch {
      return left(new AuthenticationError());
    }
  }
}
