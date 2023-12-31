import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { CacheService } from '../cache/cache.service';
import { TargetRepository } from './repositories/target.repository';
import { Target } from './entities/target.entity';
import { BasicCrudService } from '../common/basic-crud.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { UsersService } from '../users/users.service';
import { UserMetadata } from '../auth/types/user-metadata.type';
import { UserRole } from '../users/enums/user-role.enum';
import { User } from '../users/entities/user.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { TransactionEvents } from '../transaction/enums/transaction-events.enum';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class TargetService extends BasicCrudService<Target> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly targetRepository: TargetRepository,
    protected readonly entityManager: EntityManager,
    private readonly usersService: UsersService,
  ) {
    super(Target, targetRepository, cacheService, entityManager);
  }

  async find(meta: UserMetadata): Promise<Partial<Target>[]> {
    const filter: Partial<Target> = {};

    if (meta.userRole === UserRole.USER) {
      filter.user = this.entityManager.getReference(User, meta.userId);
    }

    return this.findMany(filter);
  }

  async findOneSafe(id: number, meta?: UserMetadata): Promise<Target> {
    const filter: Partial<Target> = { id };

    if (meta.userRole === UserRole.USER) {
      filter.user = this.entityManager.getReference(User, meta.userId);
    }

    return this.findOneOrFail(filter);
  }

  async createTarget(
    createTargetDto: CreateTargetDto,
    meta: UserMetadata,
  ): Promise<Target> {
    let { userId } = meta;

    if (meta.userRole === UserRole.USER) {
      userId = createTargetDto.userId ?? meta.userId;
    }

    return this.createOne({
      name: createTargetDto.name,
      description: createTargetDto.description,
      until: createTargetDto.until,
      targetQuantity: createTargetDto.targetQuantity,
      user: this.entityManager.getReference(User, userId),
    });
  }

  async updateTarget(
    updateTargetDto: UpdateTargetDto,
    meta: UserMetadata,
  ): Promise<Target> {
    const filter: Partial<Target> = { id: updateTargetDto.id };

    if (meta.userRole === UserRole.USER) {
      filter.user = this.entityManager.getReference(User, meta.userId);
    }

    return this.updateOne(filter, {
      name: updateTargetDto.name,
      description: updateTargetDto.description,
      until: updateTargetDto.until,
      targetQuantity: updateTargetDto.targetQuantity,
    });
  }

  async deleteTarget(id: number, meta: UserMetadata): Promise<Target> {
    const filter: Partial<Target> = { id };

    if (meta.userRole === UserRole.USER) {
      filter.user = this.entityManager.getReference(User, meta.userId);
    }

    return this.deleteOne(filter);
  }

  @OnEvent(TransactionEvents.CREDIT)
  async onCreditEvent(trx: Transaction) {
    if (!trx.target) return;

    const { target } = trx;

    if (target.currentQuantity === target.targetQuantity) return;

    target.currentQuantity += trx.amount;

    if (target.currentQuantity > target.targetQuantity) {
      target.currentQuantity = target.targetQuantity;
    }

    await this.updateOne(
      { id: target.id },
      { currentQuantity: target.currentQuantity },
    );
  }
}
