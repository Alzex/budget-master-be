import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

import { BasicEntity } from '../../common/basic-entity';
import { LimitsRepository } from '../repositories/limits.repository';
import { Balance } from '../../balances/entities/balance.entity';
import { User } from '../../users/entities/user.entity';

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
  @ApiProperty({ required: true })
  until: Date;

  @OneToMany(() => Balance, (balance) => balance.limit)
  balances = new Collection<Balance>(this);

  @ManyToOne(() => User)
  user?: User;
}
