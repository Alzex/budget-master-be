import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { TargetRepository } from './repositories/target.repository';
import { Target } from './entities/target.entity';
import { BasicCrudService } from '../common/basic-crud.service';
import { CreateTargetDto } from './dto/create-target.dto';
import { UsersService } from '../users/users.service';
import { UpdateTargetDto } from './dto/update-target.dto';
@Injectable()
export class TargetService extends BasicCrudService<Target> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly targetRepository: TargetRepository,
    private readonly UsersService: UsersService,
  ) {
    super(targetRepository, cacheService);
  }

  async findAllbyUserId(userId: number): Promise<Partial<Target>[]> {
    await this.UsersService.findOneByIdSafe(userId);
    const result = await this.findMany({ userId });
    return result.map((target) => target.toSafeEntity());
  }

  async createTarget(
    userId: number,
    createTargetDto: CreateTargetDto,
  ): Promise<Target> {
    await this.UsersService.findOneByIdSafe(userId);
    return this.createOne(createTargetDto);
  }

  async updateTarget(
    userId: number,
    updateTargetDto: UpdateTargetDto,
  ): Promise<Target> {
    await this.UsersService.findOneByIdSafe(userId);
    return this.update(updateTargetDto.id, updateTargetDto);
  }

  async deleteTarget(userId: number, id: number): Promise<number> {
    await this.UsersService.findOneByIdSafe(userId);
    return this.delete({ id });
  }
}
