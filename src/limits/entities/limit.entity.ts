import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

import { BasicEntity } from '../../common/basic-entity';
import { LimitsRepository } from '../repositories/limits.repository';

@Entity({ tableName: 'limits', repository: () => LimitsRepository })
export class Limit extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @Property()
  @ApiProperty()
  name: string;

  @Property()
  @ApiProperty()
  maxLoss: number;

  @Property()
  @ApiProperty()
  days: number;
}
