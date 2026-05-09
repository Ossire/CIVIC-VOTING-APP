import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Poll } from './poll.entity';
import { Option } from './option.entity';

@Entity('votes')
@Unique(['voter', 'poll'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  voter: User;

  @ManyToOne(() => Poll, (poll) => poll.id)
  poll: Poll;

  @ManyToOne(() => Option, (option) => option.id)
  choice: Option;

  @CreateDateColumn()
  createdAt: Date;
}
