import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';

import { Poll } from './entities/poll.entity';
import { Vote } from './entities/vote.entity';
import { Option } from './entities/option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { UpdatePollDto } from './dto/update-poll.dto';

interface RawVoteResult {
  optionId: number;
  count: string;
}
@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollRepo: Repository<Poll>,
    @InjectRepository(Vote)
    private voteRepo: Repository<Vote>,
    @InjectRepository(Option)
    private optionRepo: Repository<Option>,
  ) {}

  async createPoll(createPollDto: CreatePollDto, pollOwner: User) {
    const slug = createPollDto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newPoll = this.pollRepo.create({ ...createPollDto, slug, pollOwner });

    return await this.pollRepo.save(newPoll);
  }

  async castVote(pollId: string, optionId: number, userId: string) {
    const poll = await this.pollRepo.findOneBy({ id: pollId });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }
    if (new Date() > poll.endsAt) {
      throw new BadRequestException('This poll has already ended');
    }

    const option = await this.optionRepo.findOne({
      where: { id: optionId, poll: { id: pollId } },
    });

    if (!option) {
      throw new BadRequestException('Invalid option for this poll');
    }

    try {
      const newVote = this.voteRepo.create({
        voter: { id: userId },
        poll: poll,
        choice: option,
      });

      return await this.voteRepo.save(newVote);
    } catch (error) {
      throw new ConflictException('You have already voted in this poll');
    }
  }

  async getResults(pollId: string, userId: string) {
    const polll = await this.pollRepo.findOne({
      where: { id: pollId },
      relations: ['options', 'pollOwner'],
    });

    if (!polll) throw new NotFoundException('Poll not found');

    const isOwner = polll.pollOwner.id === userId;

    const hasVoted = await this.voteRepo.findOne({
      where: {
        poll: { id: pollId },
        voter: { id: userId },
      },
    });

    if (!isOwner && !hasVoted) {
      throw new ForbiddenException(
        'You must vote to see the results of this poll.',
      );
    }

    const poll = await this.pollRepo.findOne({
      where: { id: pollId },
      relations: ['options'],
    });

    if (!poll) throw new NotFoundException('Poll not found');

    const results = await this.voteRepo
      .createQueryBuilder('vote')
      .select('vote.choiceId', 'optionId')
      .addSelect('COUNT(vote.id)', 'count')
      .where('vote.pollId = :pollId', { pollId })
      .groupBy('vote.choiceId')
      .getRawMany<RawVoteResult>();

    const optionsWithCounts = poll.options.map((option) => {
      const voteData = results.find((r) => r.optionId === option.id);
      return {
        ...option,
        voteCount: voteData ? parseInt(voteData.count, 10) : 0,
      };
    });

    return {
      pollTitle: poll.title,
      totalVotes: optionsWithCounts.reduce(
        (sum, opt) => sum + opt.voteCount,
        0,
      ),
      results: optionsWithCounts,
    };
  }

  async findAll() {
    return await this.pollRepo.find({ relations: ['options'] });
  }

  async deletePoll(pollId: string) {
    const poll = await this.pollRepo.findOne({
      where: { id: pollId },
      relations: ['options'],
    });

    if (!poll) {
      throw new NotFoundException('Resource not found');
    }

    await this.pollRepo.remove(poll);

    return {
      message: `Poll {poll.title} and its options  succesfully deleted`,
    };
  }

  async updatePoll(pollId: string, updateDto: UpdatePollDto) {
    const poll = await this.pollRepo.findOne({
      where: { id: pollId },
      relations: ['options'],
    });

    if (!poll) {
      throw new NotFoundException('Resource doesnt exist');
    }

    const updatedPoll = this.pollRepo.merge(poll, updateDto);
    await this.pollRepo.save(updatedPoll);
    return {
      message: `Poll  ${poll.title} succesfully upadated`,
    };
  }
}
