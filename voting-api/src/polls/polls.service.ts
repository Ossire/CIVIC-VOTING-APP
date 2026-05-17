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
      console.log(error);
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

    const hasVotedOnThisPoll = await this.voteRepo.findOne({
      where: {
        poll: { id: pollId },
        voter: { id: userId },
      },
    });

    const hasVotedOnAnyPoll = await this.voteRepo.findOne({
      where: { voter: { id: userId } },
    });

    if (!isOwner && !hasVotedOnAnyPoll) {
      throw new ForbiddenException(
        'We detected you havent voted on any poll. Vote on any active poll to be able to view results of all active and closed polls',
      );
    }
    const pollIsActive = new Date() < new Date(polll.endsAt);
    if (!isOwner && !hasVotedOnThisPoll && pollIsActive) {
      throw new ForbiddenException(
        'Because this poll is still active...Vote before you can see the result',
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
      pollId: polll.id,
      pollTitle: polll.title,
      endsAt: polll.endsAt,
      totalVotes: optionsWithCounts.reduce(
        (sum, opt) => sum + opt.voteCount,
        0,
      ),
      results: optionsWithCounts,
    };
  }

  async findAll(userId: string) {
    const polls = await this.pollRepo
      .createQueryBuilder('poll')
      .leftJoinAndSelect('poll.options', 'options')
      .loadRelationCountAndMap('poll.voteCount', 'poll.votes')
      .getMany();

    return await Promise.all(
      polls.map(async (poll) => {
        const vote = await this.voteRepo.findOneBy({
          poll: { id: poll.id },
          voter: { id: userId },
        });

        return {
          ...poll,
          userHasVoted: !!vote,
          status: new Date() > poll.endsAt ? 'Closed' : 'Active',
        };
      }),
    );
  }

  async findById(pollId: string, userId: string) {
    const poll = await this.pollRepo.findOne({
      where: { id: pollId },
      relations: ['options'],
    });
    if (!poll) {
      throw new NotFoundException('Poll not found ');
    }

    const vote = await this.voteRepo.findOneBy({
      poll: { id: pollId },
      voter: { id: userId },
    });

    return { ...poll, userHasVoted: !!vote };
  }

  async deletePoll(pollId: string) {
    const poll = await this.pollRepo.findOne({
      where: { id: pollId },
      relations: ['options'],
    });

    if (!poll) throw new NotFoundException('Resource not found');

    await this.pollRepo.softRemove(poll);

    return {
      message: `Poll "${poll.title}" and its options have been archived.`,
    };
  }

  async updatePoll(pollId: string, updateDto: UpdatePollDto) {
    const { deleteOptions, options, ...pollData } = updateDto;

    const poll = await this.pollRepo.findOne({
      where: { id: pollId },
      relations: ['options'],
    });

    if (!poll) {
      throw new NotFoundException('Resource does not exist');
    }

    if (deleteOptions && deleteOptions.length > 0) {
      await this.optionRepo.delete(deleteOptions);

      poll.options = poll.options.filter(
        (opt) => !deleteOptions.includes(opt.id),
      );
    }

    Object.assign(poll, pollData);

    if (options) {
      poll.options = options.map((dtoOpt) => {
        const existing = poll.options.find((o) => o.id === dtoOpt.id);
        if (existing) {
          return { ...existing, text: String(dtoOpt.text) };
        }

        return this.optionRepo.create({ text: String(dtoOpt.text) });
      });
    }

    await this.pollRepo.save(poll);

    return {
      message: `Poll "${poll.title}" successfully updated`,
    };
  }
  async getVotedHistory(userId: string) {
    const userVotes = await this.voteRepo.find({
      where: { voter: { id: userId } },
      relations: ['poll', 'poll.options', 'choice'],
      withDeleted: true,
      order: { createdAt: 'DESC' },
    });

    const historyData = await Promise.all(
      userVotes.map(async (vote) => {
        const poll = vote.poll;

        if (!poll || !poll.options) return null;

        const results = await this.voteRepo
          .createQueryBuilder('vote')
          .withDeleted()
          .select('vote.choiceId', 'optionId')
          .addSelect('COUNT(vote.id)', 'count')
          .where('vote.pollId = :pollId', { pollId: poll.id })
          .groupBy('vote.choiceId')
          .getRawMany<RawVoteResult>();

        const totalVotes = results.reduce(
          (sum: number, r: RawVoteResult) => sum + parseInt(r.count, 10),
          0,
        );

        const isClosed = new Date() > poll.endsAt;

        let maxVotes = -1;
        let winnerOption = '';

        const optionsWithStats = poll.options.map((opt) => {
          const voteData = results.find((r) => Number(r.optionId) === opt.id);
          const count = voteData ? parseInt(voteData.count, 10) : 0;
          const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;

          if (count > maxVotes) {
            maxVotes = count;
            winnerOption = opt.text;
          }

          return {
            ...opt,
            voteCount: count,
            percentage: percentage.toFixed(1),
          };
        });

        return {
          id: poll.id,
          title: poll.title,
          status: isClosed ? 'Closed' : 'Active',
          votedAt: vote.createdAt,
          userChoice: vote.choice.text,
          totalVotes,
          results: optionsWithStats,
          winner: isClosed ? winnerOption : 'Pending',
        };
      }),
    );

    return historyData.filter((item) => item !== null);
  }
}
