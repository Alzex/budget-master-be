import { Injectable } from '@nestjs/common';
import { BasicCrudService } from '../common/basic-crud.service';
import { Currency } from './entities/currency.entity';
import { CacheService } from '../cache/cache.service';
import { EntityManager } from '@mikro-orm/core';
import { CurrenciesRepository } from './repositories/currencies.repository';

@Injectable()
export class CurrenciesService extends BasicCrudService<Currency> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly currenciesRepository: CurrenciesRepository,
    protected readonly entityManager: EntityManager,
  ) {
    super(Currency, currenciesRepository, cacheService, entityManager);
  }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}
