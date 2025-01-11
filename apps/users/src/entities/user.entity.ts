import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { History } from '../history/entities/history.entity';
import { Role } from '@app/iam/authorization/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  surnames: string;

  @Column()
  email: string;

  @Column('boolean', { default: false })
  isEmailPublic: boolean;

  @Column({ nullable: true })
  password: string;

  @Column()
  birthdate: Date;

  @Column('boolean', { default: false })
  isBirthdatePublic: boolean;

  @Column({ nullable: true })
  presentation: string;

  @Column({ type: 'enum', enum: Role, default: Role.Registered })
  role: Role;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  githubId: string;

  @JoinTable()
  @OneToMany((type) => History, (history) => history.user, {
    cascade: true,
  })
  history: History[];
}
