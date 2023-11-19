import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { wrap } from '@mikro-orm/core';

@Injectable()
export class UsersService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly userRepository: UserRepository,
  ) {}

  async findOne(args: Partial<User>): Promise<User | null> {
    return this.userRepository.findOne(args);
  }

  async createOne(args: Partial<User>): Promise<User> {
    const user = this.userRepository.create(args);

    await this.userRepository.upsert(user);

    return user;
  }

  async findAllSafe(): Promise<User[]> {
    const result = await this.userRepository.findAll();
    return result.map((user) => wrap(user).toObject());
  }
}
