import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { History } from '../history/entities/history.entity';
import { Role } from '../enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surnames: string;

  @Column()
  email: string;

  @Column()
  isEmailPublic: boolean;

  @Column()
  password: string;

  @Column()
  birthdate: Date;

  @Column()
  isBirthdatePublic: boolean;

  @Column({ nullable: true })
  presentation: string;

  @Column({ type: 'enum', enum: Role, default: Role.Registered })
  role: Role;

  @JoinTable()
  @OneToMany((type) => History, (history) => history.user, { cascade: true })
  history: History[];
}
