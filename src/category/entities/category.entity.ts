import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { CategoryRepository } from '../repositories/category.repository';
import { BasicEntity } from '../../common/basic-entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ repository: () => CategoryRepository })
export class Category extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @Property({ unique: true })
  @ApiProperty()
  name: string;
}
