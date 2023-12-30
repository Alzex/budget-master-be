import { EntityRepository } from '@mikro-orm/mysql';
import { Balance } from '../entities/balance.entity';

export class BalanceRepository extends EntityRepository<Balance> {}
