import { UniqueEntityID } from 'libs/base/domain/UniqueEntityID';
import * as Domain from './domain';
import * as Persistence from './persistence';
import { Role } from '@app/iam/authorization/enums/role.enum';

export class UserMapper {
  static toDomain(raw: Persistence.User): Domain.User {
    return Domain.User.create({
      id: new UniqueEntityID(raw.id),
      name: raw.name,
      surnames: raw.surnames,
      email: raw.email,
      isEmailPublic: raw.isEmailPublic,
      password: raw.password,
      birthdate: raw.birthdate,
      isBirthdatePublic: raw.isBirthdatePublic,
      presentation: raw.presentation,
      role: raw.role,
      googleId: raw.googleId,
      githubId: raw.githubId,
      history: raw.history,
    });
  }

  static toPersistence(user: Domain.User): Persistence.User {
    return {
      id: user.id.toString(),
      name: user.name,
      surnames: user.surnames,
      email: user.email,
      isEmailPublic: user.isEmailPublic,
      password: user.password,
      birthdate: user.birthdate,
      isBirthdatePublic: user.isBirthdatePublic,
      presentation: user.presentation,
      role: user.role as Role,
      googleId: user.googleId,
      githubId: user.githubId,
      history: user.history,
    };
  }
}
