import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';

import { CacheService } from '../cache/cache.service';
import { TargetRepository } from './repositories/target.repository';
import { Target } from './entities/target.entity';
import { BasicCrudService } from '../common/basic-crud.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { UpdateTargetDto } from './dto/update-target.dto';
import { UsersService } from '../users/users.service';

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

  async findAllByUserId(userId: number): Promise<Partial<Target>[]> {
    const result = await this.findManyCached({ userId });
    return result.map((target) => target.toSafeEntity());
  }

  async createTarget(
    userId: number,
    createTargetDto: CreateTargetDto,
  ): Promise<Target> {
    await this.usersService.findOneByIdSafe(userId);
    return this.createOne(createTargetDto);
  }

  async updateTarget(
    userId: number,
    updateTargetDto: UpdateTargetDto,
  ): Promise<Target> {
    await this.usersService.findOneByIdSafe(userId);
    return this.updateOne(
      {
        id: updateTargetDto.id,
      },
      updateTargetDto,
    );
  }

  async deleteTarget(id: number): Promise<Target> {
    return this.deleteOne({ id });
  }
}
