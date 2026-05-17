import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Vote } from 'src/polls/entities/vote.entity';
import { Not, Repository, FindOptionsWhere } from 'typeorm';
import { Roles } from 'src/common/enums/roles.enums';
import { NigerianStates } from 'src/common/enums/state.enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Vote)
    private voteRepo: Repository<Vote>,
  ) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const userCount = await this.userRepo.count();
    const role = userCount === 0 ? Roles.ADMIN : Roles.USER;

    const newUser = this.userRepo.create({ ...userData, role });

    return await this.userRepo.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'state', 'name'],
    });
  }

  async getAuditLog() {
    return await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.votes', 'vote')
      .leftJoinAndSelect('vote.poll', 'poll')
      .leftJoinAndSelect('vote.choice', 'option')
      .where('user.role = :role', { role: Roles.USER })
      .orderBy('vote.createdAt', 'DESC')
      .getMany();
  }

  async countEligibleVoters(): Promise<number> {
    return await this.userRepo.count({
      where: {
        role: Not(Roles.ADMIN),
      },
    });
  }

  async getVoterCountByState(
    state: NigerianStates,
  ): Promise<number | { message: string }> {
    if (!state) {
      return { message: 'Pls select a state' };
    }
    const countByState = await this.userRepo.count({
      where: { state: state, role: Not(Roles.ADMIN) },
    });

    return countByState;
  }

  async getVoterByState(state: NigerianStates, pollId: string) {
    const criteria: FindOptionsWhere<User> = {
      role: Not(Roles.ADMIN),
    };

    const totalInState = await this.userRepo.count({
      where: {
        ...criteria,
        state: state,
      },
    });

    const votedInState = await this.voteRepo.count({
      where: {
        poll: { id: pollId },
        voter: { state: state, role: Not(Roles.ADMIN) },
      },
    });

    return { votedInState, totalInState };
  }
}
