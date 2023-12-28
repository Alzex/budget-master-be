import { EntityRepository } from '@mikro-orm/mysql';
import { Limit } from '../entities/limit.entity';

export class LimitsRepository extends EntityRepository<Limit> {}
