import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { FindUserArgs } from './args/find-user.args';
import { plainToInstance } from 'class-transformer';

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

  async complexSearch(args: FindUserArgs): Promise<Partial<User>[]> {
    const query = this.userRepository.qb().select('*');

    if (args.id) {
      query.andWhere({ id: args.id });
    }

    if (args.email) {
      query.andWhere({ email: args.email });
    }

    if (args.username) {
      query.andWhere({ username: args.username });
    }

    if (args.role) {
      query.andWhere({ role: args.role });
    }

    if (args.search) {
      query.andWhere({
        $or: [
          { email: { $like: `%${args.search}%` } },
          { username: { $like: `%${args.search}%` } },
        ],
      });
    }

    const result = await query.execute();

    return result.map((user) => plainToInstance(User, user).toSafeEntity());
  }
}
