import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Option } from './option.entity';
import { User } from 'src/users/entities/user.entity';
import { Vote } from './vote.entity';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Option, (option) => option.poll, { cascade: true })
  options: Option[];

  @ManyToOne(() => User, (user) => user.poll)
  pollOwner: User;

  @OneToMany(() => Vote, (vote) => vote.poll)
  votes: Vote[];

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  endsAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
