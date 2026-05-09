import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Param,
  Body,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { RolesDec } from 'src/auth/decorators/roles.decorator';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdatePollDto } from './dto/update-poll.dto';

@UseGuards(AuthGuard())
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RolesDec('admin')
  async createPoll(
    @Body() createPollDto: CreatePollDto,
    @GetUser() user: User,
  ) {
    return this.pollsService.createPoll(createPollDto, user);
  }

  @Post(':pollId/vote/:optionId')
  @UseGuards(AuthGuard('jwt'))
  async vote(
    @Param('pollId') pollId: string,
    @Param('optionId', ParseIntPipe) optionId: number,
    @GetUser() user: User,
  ) {
    return this.pollsService.castVote(pollId, optionId, user.id);
  }

  @Get(':pollId/results')
  async getPollResults(@Param('pollId') pollId: string, @GetUser() user: User) {
    return this.pollsService.getResults(pollId, user.id);
  }

  @Get()
  async getPolls() {
    return this.pollsService.findAll();
  }

  @Delete(':pollId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RolesDec('admin')
  async deletePolll(@Param('pollId') pollId: string) {
    return this.pollsService.deletePoll(pollId);
  }

  @Patch(':pollId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RolesDec('admin')
  async updatePolll(
    @Param('pollId') pollId: string,
    @Body() dto: UpdatePollDto,
  ) {
    return this.pollsService.updatePoll(pollId, dto);
  }
}
