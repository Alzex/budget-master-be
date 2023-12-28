import { EntityRepository } from '@mikro-orm/mysql';
import { Transaction } from '../entities/target.entity';

export class TargetRepository extends EntityRepository<Transaction> {}
