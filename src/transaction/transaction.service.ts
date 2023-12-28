import { Injectable } from '@nestjs/common';
import { BasicCrudService } from '../common/basic-crud.service';
import { Transaction } from './entities/transaction.entity';
import { CacheService } from '../cache/cache.service';

class TransactionRepository {}

@Injectable()
export class TransactionService extends BasicCrudService<Transaction> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly transactionRepository: TransactionRepository,
  ) {
    super(transactionRepository, cacheService);
  }
}
