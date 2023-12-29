import { Injectable } from '@nestjs/common';
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
  async createCategory(
    userRole: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    if (userRole !== 'ADMIN') {
      throw new Error('Only admin can create categories');
    }
    return this.createOne(createCategoryDto);
  }
  async deleteCategory(id: number): Promise<Category> {
    return this.deleteOne({ id });
  }
}
