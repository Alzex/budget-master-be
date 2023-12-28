import { EntityRepository } from '@mikro-orm/mysql';
import { Currency } from '../entities/currency.entity';

export class CurrenciesRepository extends EntityRepository<Currency> {}
