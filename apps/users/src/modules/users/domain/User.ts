import { Role } from '@app/iam/authorization/enums/role.enum';
import { AggregateRoot } from 'libs/base/domain/AggregateRoot';
import { UniqueEntityID } from 'libs/base/domain/UniqueEntityID';

export interface UserProps {
  id: UniqueEntityID;
  name: string;
  surnames: string;
  email: string;
  isEmailPublic: boolean;
  password: string;
  birthdate: Date;
  isBirthdatePublic: boolean;
  presentation: string;
  role: Role;
  googleId: string;
  githubId: string;
  history: any[];
}

export class User extends AggregateRoot<UserProps> {
  protected constructor(props: UserProps) {
    super(props);
  }

  get id(): UniqueEntityID {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get surnames(): string {
    return this.props.surnames;
  }

  get email(): string {
    return this.props.email;
  }

  get isEmailPublic(): boolean {
    return this.props.isEmailPublic;
  }

  get password(): string {
    return this.props.password;
  }

  get birthdate(): Date {
    return this.props.birthdate;
  }

  get isBirthdatePublic(): boolean {
    return this.props.isBirthdatePublic;
  }

  get presentation(): string {
    return this.props.presentation;
  }

  get role(): Role {
    return this.props.role;
  }

  get googleId(): string {
    return this.props.googleId;
  }

  get githubId(): string {
    return this.props.githubId;
  }

  get history(): any[] {
    return this.props.history;
  }

  public static create(props: UserProps): User {
    return new User(props);
  }
}
