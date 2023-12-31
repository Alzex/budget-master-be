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
    return this.entityRepository.findOne(args, { ...options, populate: true });
  }

  async findOneOrFail(
    args: FilterQuery<T>,
    options?: FindOptions<T>,
  ): Promise<T> {
    try {
      const result = await this.entityRepository.findOneOrFail(args, {
        ...options,
        populate: true,
      });
      return result;
    } catch (e) {
      throw new NotFoundException(`${this.entityClass.name} not found`);
    }
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
    return this.entityRepository.find(args, {
      ...options,
      populate: true,
    });
  }

  @ThroughCache(60)
  async findManyCached(
    args?: FilterQuery<T>,
    options?: FindOptions<T, never>,
  ): Promise<T[]> {
    return this.findMany(args, options);
  }

  async upsert(entity: RequiredEntityData<T>): Promise<T> {
    const newEntity = this.entityRepository.create(entity);

    await Promise.all([
      this.flushCrudCache(),
      this.entityManager.upsert(newEntity),
    ]);
    return this.findOne(newEntity as FilterQuery<T>);
  }

  async createOne(data: RequiredEntityData<T>): Promise<T> {
    const entity = this.entityRepository.create(data);

    await Promise.all([
      this.flushCrudCache(),
      this.entityManager.persistAndFlush(entity as T),
    ]);

    return this.findOne(entity as FilterQuery<T>);
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

    return this.findOne(entity);
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
