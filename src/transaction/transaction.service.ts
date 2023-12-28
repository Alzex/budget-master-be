import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { BasicCrudService } from '../common/basic-crud.service';
import { Transaction } from './entities/transaction.entity';
import { CacheService } from '../cache/cache.service';
import { TransactionRepository } from './repositories/transaction.repository';

@Injectable()
export class TransactionService extends BasicCrudService<Transaction> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly transactionRepository: TransactionRepository,
    protected readonly entityManager: EntityManager,
  ) {
    super(Transaction, transactionRepository, cacheService, entityManager);
  }
}
