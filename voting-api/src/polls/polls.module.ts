import { forwardRef, Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { Option } from './entities/option.entity';
import { Vote } from './entities/vote.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Poll, Vote, Option]),
  ],
  controllers: [PollsController],
  providers: [PollsService],
})
export class PollsModule {}
