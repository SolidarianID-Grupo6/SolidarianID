import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { History } from '../history/entities/history.entity';

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

  @JoinTable()
  @OneToMany((type) => History, (history) => history.user, { cascade: true })
  history: History[];
}
