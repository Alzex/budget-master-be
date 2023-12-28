import { EntityRepository } from '@mikro-orm/mysql';
import { Target } from '../entities/target.entity';

export class TargetRepository extends EntityRepository<Target> {}
