import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Param,
  Body,
  ParseIntPipe,
  ParseUUIDPipe,
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

@UseGuards(AuthGuard('jwt'))
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post('create')
  @UseGuards(RolesGuard)
  @RolesDec('admin')
  async createPoll(
    @Body() createPollDto: CreatePollDto,
    @GetUser() user: User,
  ) {
    return this.pollsService.createPoll(createPollDto, user);
  }

  @Post(':pollId/vote/:optionId')
  @UseGuards(RolesGuard)
  @RolesDec('user')
  async vote(
    @Param('pollId') pollId: string,
    @Param('optionId', ParseIntPipe) optionId: number,
    @GetUser() user: User,
  ) {
    return this.pollsService.castVote(pollId, optionId, user.id);
  }

  @Get(':pollId/result')
  async getPollResults(@Param('pollId') pollId: string, @GetUser() user: User) {
    return this.pollsService.getResults(pollId, user.id);
  }

  @Get()
  async getPolls(@GetUser() user: User) {
    return this.pollsService.findAll(user.id);
  }

  @Get(':pollId')
  async getPollById(
    @Param('pollId', new ParseUUIDPipe()) pollId: string,
    @GetUser() user: User,
  ) {
    return this.pollsService.findById(pollId, user.id);
  }

  @Delete(':pollId')
  @UseGuards(RolesGuard)
  @RolesDec('admin')
  async deletePolll(@Param('pollId') pollId: string) {
    return this.pollsService.deletePoll(pollId);
  }

  @Patch(':pollId')
  @UseGuards(RolesGuard)
  @RolesDec('admin')
  async updatePolll(
    @Param('pollId') pollId: string,
    @Body() dto: UpdatePollDto,
  ) {
    return this.pollsService.updatePoll(pollId, dto);
  }

  @Get('user/history')
  @UseGuards(AuthGuard('jwt'))
  async getHistory(@GetUser() user: User) {
    return this.pollsService.getVotedHistory(user.id);
  }

  // @Get('voter-by-state')
  // async getVoterByState(@Query('state') state: NigerianStates, pollId: string) {
  //   return this.pollsService.getVoterByState(state, pollId);
  // }
}
