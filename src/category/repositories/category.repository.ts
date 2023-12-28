import { EntityRepository } from '@mikro-orm/core';
import { Category } from '../entities/category.entity';

export class CategoryRepository extends EntityRepository<Category> {}
