import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BasicEntity } from '../../common/basic-entity';
import { User } from '../../users/entities/user.entity';
import { Limit } from '../../limits/entities/limit.entity';
import { Currency } from '../../currencies/entities/currency.entity';

@Entity({ tableName: 'balances' })
export class Balance extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property()
  amount: number;

  @Property()
  currencyId: string;

  @Property()
  userId: number;

  @Property({ nullable: true })
  limitId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Limit)
  limit: Limit;

  @ManyToOne(() => Currency)
  currency: Currency;
}
