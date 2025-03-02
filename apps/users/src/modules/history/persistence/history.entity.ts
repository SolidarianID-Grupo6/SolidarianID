import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommunityEvent } from 'libs/events/enums/community.events.enum';
import { User } from '../../users/entities/user.entity';

@Entity('history')
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CommunityEvent })
  action: string;

  @ManyToOne(() => User, (user) => user.history, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  eventDate: Date;

  // Collumn that stores a JSON object and can be null:
  @Column('json', { nullable: true })
  data: Object;
}
