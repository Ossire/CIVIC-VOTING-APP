import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getUser(@GetUser() user: User): User {
    return user;
  }
}
