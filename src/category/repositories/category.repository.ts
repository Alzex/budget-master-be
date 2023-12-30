import { EntityRepository } from '@mikro-orm/mysql';
import { Category } from '../entities/category.entity';

export class CategoryRepository extends EntityRepository<Category> {}
