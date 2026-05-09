import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Roles } from 'src/common/enums/roles.enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
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
      select: ['id', 'email', 'password', 'role', 'state'],
    });
  }
}
