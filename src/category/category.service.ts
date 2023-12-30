import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { BasicCrudService } from '../common/basic-crud.service';
import { CacheService } from '../cache/cache.service';
import { CategoryRepository } from './repositories/category.repository';
import { EntityManager } from '@mikro-orm/core';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService extends BasicCrudService<Category> {
  constructor(
    protected readonly cacheService: CacheService,
    protected readonly categoryRepository: CategoryRepository,
    protected readonly entityManager: EntityManager,
  ) {
    super(Category, categoryRepository, cacheService, entityManager);
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.findOne({ name: dto.name });

    if (existing) {
      throw new BadRequestException('Category already exists');
    }

    return this.createOne(dto);
  }
}
