import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager, FilterQuery } from '@mikro-orm/core';

import { BasicCrudService } from '../common/basic-crud.service';
import { Transaction } from './entities/transaction.entity';
import { CacheService } from '../cache/cache.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { UserRole } from '../users/enums/user-role.enum';
import { BalancesService } from '../balances/balances.service';
import { UsersService } from '../users/users.service';
import { TransactionType } from './enums/transaction-type.enum';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TransactionService extends BasicCrudService<Transaction> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly transactionRepository: TransactionRepository,
    protected readonly entityManager: EntityManager,
    private readonly balancesService: BalancesService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoryService,
  ) {
    super(Transaction, transactionRepository, cacheService, entityManager);
  }

  async findOneSafe(id: number, meta?: UserMetadata) {
    const filter: FilterQuery<Transaction> = { id };

    if (meta.userRole === UserRole.USER) {
      filter.user = this.entityManager.getReference(User, meta.userId);
    }

    return this.findOneOrFail(filter);
  }

  async find(meta: UserMetadata) {
    const filter: FilterQuery<Transaction> = {};

    if (meta.userRole === UserRole.USER) {
      filter.user = this.entityManager.getReference(User, meta.userId);
    }

    return this.findMany(filter);
  }

  async create(dto: CreateTransactionDto, meta: UserMetadata) {
    let ownerId = meta.userId;
    let category: Category;

    if (meta.userRole === UserRole.ADMIN) {
      ownerId = dto.userId ?? meta.userId;
    }

    const [user, balance] = await Promise.all([
      this.usersService.findOneOrFail(ownerId),
      this.balancesService.findOneSafe(dto.balanceId, meta),
      this.categoriesService.findOneOrFail(dto.categoryId),
    ]);

    switch (dto.type) {
      case TransactionType.DEBIT:
        let debitAllowed = true;

        debitAllowed = debitAllowed && balance.amount >= dto.amount;

        if (balance.limit && !dto.ignoreLimit) {
          debitAllowed = balance.limit.maxLoss >= dto.amount;
        }

        if (!debitAllowed) {
          throw new BadRequestException('Not enough funds or limit exceeded');
        }

        balance.amount -= dto.amount;
        break;
      case TransactionType.CREDIT:
        balance.amount += dto.amount;
        break;
    }

    if (dto.categoryId) {
      category = await this.categoriesService.findOneOrFail(dto.categoryId);
    }

    return this.createOne({
      amount: dto.amount,
      ignoreLimit: dto.ignoreLimit,
      type: dto.type,
      user,
      balance,
      category,
    });
  }
}
