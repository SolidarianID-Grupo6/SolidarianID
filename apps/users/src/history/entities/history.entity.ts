import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../entities/user.entity';

@Entity('history')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @ManyToOne(() => User, (user) => user.history)
  @JoinColumn({ name: 'userId' })
  user: User;
}
