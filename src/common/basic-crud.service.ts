import { BasicEntity } from './basic-entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { CacheService } from '../cache/cache.service';
import {
  EntityManager,
  FilterQuery,
  FindOptions,
  RequiredEntityData,
} from '@mikro-orm/core';
import { ThroughCache } from '../cache/decorators/through-cache.decorator';
import { NotFoundException } from '@nestjs/common';

export class BasicCrudService<T extends BasicEntity> {
  constructor(
    protected readonly entityClass: new () => T,
    protected readonly entityRepository: EntityRepository<T>,
    protected readonly cacheService: CacheService,
    protected readonly entityManager: EntityManager,
  ) {}

  async findOne(args: FilterQuery<T>, options?: FindOptions<T>): Promise<T> {
    return this.entityRepository.findOne(args, options);
  }

  // 1 minute
  @ThroughCache(60)
  async findOneCached(
    args?: FilterQuery<T>,
    options?: FindOptions<T>,
  ): Promise<T> {
    return this.findOne(args, options);
  }

  async findMany(
    args?: FilterQuery<T>,
    options?: FindOptions<T>,
  ): Promise<T[]> {
    return this.entityRepository.find(args, options);
  }

  @ThroughCache(60)
  async findManyCached(
    args?: FilterQuery<T>,
    options?: FindOptions<T, never>,
  ): Promise<T[]> {
    return this.findMany(args, options);
  }

  async upsert(entity: Partial<T>): Promise<T> {
    await Promise.all([
      this.flushCrudCache(),
      this.entityManager.upsert(entity),
    ]);
    return this.findOne(entity as FilterQuery<T>);
  }

  async createOne(data: RequiredEntityData<T>): Promise<T> {
    const entity = this.entityRepository.create(data);

    await Promise.all([
      this.flushCrudCache(),
      this.entityRepository.nativeInsert(entity as T),
    ]);

    return entity;
  }

  async updateOne(
    args: FilterQuery<T>,
    data: RequiredEntityData<T>,
  ): Promise<T> {
    const entity = await this.findOne(args);

    if (!entity) {
      throw new NotFoundException(
        `No ${this.entityClass.name} found to update`,
      );
    }

    await Promise.all([
      this.flushCrudCache(),
      this.entityRepository.nativeUpdate(args, data),
    ]);

    return Object.assign(entity, data);
  }

  async deleteOne(args: FilterQuery<T>): Promise<T> {
    const entity = await this.findOne(args);

    if (!entity) {
      throw new NotFoundException(
        `No ${this.entityClass.name} found to delete`,
      );
    }

    await Promise.all([
      this.flushCrudCache(),
      this.entityManager.remove(entity).flush(),
    ]);

    return entity;
  }

  flushCrudCache(): Promise<void> {
    return this.cacheService.deletePattern(`${this.constructor.name}:*`);
  }
}
