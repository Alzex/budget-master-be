import { EntityRepository } from '@mikro-orm/mysql';
import { Transaction } from '../entities/transaction.entity';

export class TransactionRepository extends EntityRepository<Transaction> {}
