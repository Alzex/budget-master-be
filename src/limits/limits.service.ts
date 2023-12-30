import { Injectable } from '@nestjs/common';
import { EntityManager, FilterQuery } from '@mikro-orm/core';

import { Limit } from './entities/limit.entity';
import { BasicCrudService } from '../common/basic-crud.service';
import { CacheService } from '../cache/cache.service';
import { LimitsRepository } from './repositories/limits.repository';
import { FindLimitArgs } from './args/find-limit.args';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateLimitDto } from './dto/create-limit.dto';
import { UpdateLimitDto } from './dto/update-limit.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LimitsService extends BasicCrudService<Limit> {
  constructor(
    protected readonly limitsRepository: LimitsRepository,
    protected readonly cacheService: CacheService,
    protected readonly entityManager: EntityManager,
  ) {
    super(Limit, limitsRepository, cacheService, entityManager);
  }

  async findAll(args: FindLimitArgs, meta: UserMetadata) {
    const { userId, userRole } = meta;
    const filter: FilterQuery<Limit> = {};

    if (args.balanceId) {
      filter.balances = { id: args.balanceId };
    }

    if (userRole === UserRole.USER) {
      filter.user = { id: userId };
    }

    return this.findMany(filter);
  }

  async findOneSafe(id: number, meta: UserMetadata) {
    const { userId, userRole } = meta;
    const filter: FilterQuery<Limit> = { id };

    if (userRole === UserRole.USER) {
      filter.user = { id: userId };
    }

    return this.findOneOrFail(filter);
  }

  async create(dto: CreateLimitDto, meta: UserMetadata) {
    let ownerId = meta.userId;

    if (meta.userRole === UserRole.ADMIN) {
      ownerId = dto.userId ?? meta.userId;
    }

    dto.userId = undefined;

    return this.createOne({
      ...dto,
      user: this.entityManager.getReference(User, ownerId),
    });
  }

  async update(dto: UpdateLimitDto, meta: UserMetadata) {
    const { id } = dto;
    const filter: FilterQuery<Limit> = { id };

    if (meta.userRole === UserRole.USER) {
      filter.user = { id: meta.userId };
    }

    return this.updateOne(filter, dto);
  }

  async remove(id: number, meta: UserMetadata) {
    const filter: FilterQuery<Limit> = { id };

    if (meta.userRole === UserRole.USER) {
      filter.user = { id: meta.userId };
    }

    return this.deleteOne(filter);
  }
}
