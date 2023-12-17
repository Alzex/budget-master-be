import { BasicEntity } from './basic-entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { CacheService } from '../cache/cache.service';
import { FilterQuery, RequiredEntityData } from '@mikro-orm/core';
import { ThroughCache } from '../cache/decorators/through-cache.decorator';
import { NativeInsertUpdateOptions } from '@mikro-orm/core/drivers/IDatabaseDriver';

export class BasicCrudService<T extends BasicEntity> {
  constructor(
    protected readonly entityRepository: EntityRepository<T>,
    protected readonly cacheService: CacheService,
  ) {}

  async findOne(args: FilterQuery<T>): Promise<T> {
    return this.entityRepository.findOne(args);
  }

  // 5 minutes
  @ThroughCache(300_000)
  async findOneCached(args: FilterQuery<T>): Promise<T> {
    return this.findOne(args);
  }

  async findMany(args: FilterQuery<T>): Promise<T[]> {
    return this.entityRepository.find(args);
  }

  @ThroughCache(300_000)
  async findManyCached(args: FilterQuery<T>): Promise<T[]> {
    return this.findMany(args);
  }

  async createOne(
    args: RequiredEntityData<T>,
    options?: NativeInsertUpdateOptions<T>,
  ): Promise<T> {
    const entity = this.entityRepository.create(args);

    await this.entityRepository.nativeInsert(entity, options);

    return entity;
  }

  async update(
    args: FilterQuery<T>,
    data: RequiredEntityData<T>,
    options?: NativeInsertUpdateOptions<T>,
  ): Promise<number> {
    const result = await this.entityRepository.nativeUpdate(
      args,
      data,
      options,
    );

    await this.flushCrudCache();

    return result;
  }

  async delete(args: FilterQuery<T>): Promise<number> {
    const result = await this.entityRepository.nativeDelete(args);

    await this.flushCrudCache();

    return result;
  }

  flushCrudCache(): Promise<void> {
    return this.cacheService.deletePattern(`${this.constructor.name}:*`);
  }
}
