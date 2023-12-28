import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { FindUserArgs } from './args/find-user.args';
import { plainToInstance } from 'class-transformer';
import { BasicCrudService } from '../common/basic-crud.service';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class UsersService extends BasicCrudService<User> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly userRepository: UserRepository,
    protected readonly entityManager: EntityManager,
  ) {
    super(User, userRepository, cacheService, entityManager);
  }

  async findOneByIdSafe(id: number): Promise<Partial<User>> {
    const result = await this.findOne({ id });

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return result.toSafeEntity();
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
