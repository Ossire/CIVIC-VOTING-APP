import { NigerianStates } from 'src/common/enums/state.enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Roles } from 'src/common/enums/roles.enums';
import { Poll } from 'src/polls/entities/poll.entity';
import { Vote } from 'src/polls/entities/vote.entity';
import { Exclude } from 'class-transformer';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: NigerianStates })
  state: NigerianStates;

  @OneToMany(() => Poll, (poll) => poll.pollOwner)
  poll: Poll[];

  @OneToMany(() => Vote, (vote) => vote.voter)
  votes: Vote[];

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;
}
