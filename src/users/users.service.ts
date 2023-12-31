import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { FindUserArgs } from './args/find-user.args';
import { plainToInstance } from 'class-transformer';
import { BasicCrudService } from '../common/basic-crud.service';
import { EntityManager } from '@mikro-orm/core';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { TransactionType } from '../transaction/enums/transaction-type.enum';
import { UserAnalyticsArgs } from './args/user-analytics.args';
import moment from 'moment/moment';

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

  async calculateAnalytics(userId: number, args: UserAnalyticsArgs) {
    const user = await this.findOneByIdSafe(userId);

    let incomeTrx = user.transactions.filter(
      (trx) => trx.type === TransactionType.CREDIT,
    );

    let expenseTrx = user.transactions.filter(
      (trx) => trx.type === TransactionType.DEBIT,
    );

    if (args.from) {
      incomeTrx = incomeTrx.filter((trx) =>
        moment(trx.createdAt).isSameOrAfter(args.from),
      );
      expenseTrx = expenseTrx.filter((trx) =>
        moment(trx.createdAt).isSameOrAfter(args.from),
      );
    }

    if (args.to) {
      incomeTrx = incomeTrx.filter((trx) =>
        moment(trx.createdAt).isBefore(args.from),
      );
      expenseTrx = expenseTrx.filter((trx) =>
        moment(trx.createdAt).isBefore(args.from),
      );
    }

    return {
      income: incomeTrx.reduce((acc, trx) => acc + trx.amount, 0),
      expense: expenseTrx.reduce((acc, trx) => acc + trx.amount, 0),
    };
  }
}
