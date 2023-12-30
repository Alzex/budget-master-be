import { Injectable } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { BasicCrudService } from '../common/basic-crud.service';
import { Balance } from './entities/balance.entity';
import { CacheService } from '../cache/cache.service';
import {
  EntityManager,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/core';
import { BalanceRepository } from './repositories/balance.repository';
import { LimitsService } from '../limits/limits.service';
import { UsersService } from '../users/users.service';
import { CurrenciesService } from '../currencies/currencies.service';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { UserRole } from '../users/enums/user-role.enum';
import { User } from '../users/entities/user.entity';
import { Currency } from '../currencies/entities/currency.entity';
import { Limit } from '../limits/entities/limit.entity';

@Injectable()
export class BalancesService extends BasicCrudService<Balance> {
  constructor(
    protected readonly balanceRepository: BalanceRepository,
    protected readonly cacheService: CacheService,
    protected readonly entityManager: EntityManager,
    protected readonly limitsService: LimitsService,
    protected readonly usersService: UsersService,
    protected readonly currenciesService: CurrenciesService,
  ) {
    super(Balance, balanceRepository, cacheService, entityManager);
  }

  async create(userId: number, createBalanceDto: CreateBalanceDto) {
    const { limitId, currencyId } = createBalanceDto;

    const checks: Promise<unknown>[] = [
      this.usersService.findOneOrFail({ id: userId }),
      this.currenciesService.findOneOrFail({ id: currencyId }),
    ];

    if (limitId) {
      checks.push(
        this.limitsService.findOneOrFail({
          id: limitId,
        }),
      );
    }

    await Promise.all(checks);

    return this.createOne({
      user: { id: userId },
      currency: { id: currencyId },
      limit: limitId ? { id: limitId } : undefined,
    });
  }

  findAll(meta: UserMetadata) {
    const { userId, userRole } = meta;
    let filter: FilterQuery<Balance>;

    if (userRole === UserRole.USER) {
      filter = { user: { id: userId } };
    }

    return this.findMany(filter);
  }

  findOneSafe(id: number, meta: UserMetadata) {
    const { userId, userRole } = meta;
    const filter: FilterQuery<Balance> = { id };

    if (userRole === UserRole.USER) {
      filter.user = { id: userId };
    }

    return this.findOneOrFail(filter);
  }

  async update(dto: UpdateBalanceDto, meta: UserMetadata) {
    const { id, currencyId, limitId } = dto;
    const filter: FilterQuery<Balance> = { id };
    const updateData: RequiredEntityData<Balance> = {};

    if (meta.userRole === UserRole.USER) {
      filter.user = { id: meta.userId };
    }

    const checks: Promise<unknown>[] = [this.findOneOrFail(filter)];

    if (currencyId) {
      checks.push(this.currenciesService.findOneOrFail({ id: currencyId }));
      updateData.currency = this.entityManager.getReference(
        Currency,
        currencyId,
      );
    }

    if (limitId) {
      checks.push(this.limitsService.findOneSafe(limitId, meta));
      updateData.limit = this.entityManager.getReference(Limit, limitId);
    }

    await Promise.all(checks);

    if (dto.amount) {
      updateData.amount = dto.amount;
    }

    return this.updateOne(filter, {
      ...updateData,
    });
  }

  remove(id: number, meta: UserMetadata) {
    const filter: FilterQuery<Balance> = { id };

    if (meta.userRole === UserRole.USER) {
      filter.user = { id: meta.userId };
    }

    return this.deleteOne(filter);
  }

  async validateDebit(
    userId: number,
    currencyId: number,
    amount: number,
  ): Promise<boolean> {
    let result = true;

    const balance = await this.findOneOrFail(
      {
        user: { id: userId },
        currency: { id: currencyId },
      },
      {
        populate: true,
      },
    );

    result = balance.amount >= amount;

    if (balance.limit) {
      result = result && balance.limit.maxLoss >= amount;
    }

    return result;
  }
}
