import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { NigerianStates } from 'src/common/enums/state.enums';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getUser(@GetUser() user: User): User {
    return user;
  }

  @Get('count-eligible')
  async getEligibleCount(): Promise<number> {
    return await this.usersService.countEligibleVoters();
  }

  @Get('count-by-state')
  async getVoterCountByState(@Query('state') state: NigerianStates) {
    return await this.usersService.getVoterCountByState(state);
  }

  @Get('voter-by-state')
  async getVoterByState(
    @Query('state') state: NigerianStates,
    @Query('pollId') pollId: string,
  ) {
    return this.usersService.getVoterByState(state, pollId);
  }
}
