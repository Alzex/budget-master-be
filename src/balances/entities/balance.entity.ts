import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BasicEntity } from '../../common/basic-entity';
import { User } from '../../users/entities/user.entity';
import { Limit } from '../../limits/entities/limit.entity';
import { Currency } from '../../currencies/entities/currency.entity';
import { BalanceRepository } from '../repositories/balance.repository';

@Entity({ tableName: 'balances', repository: () => BalanceRepository })
export class Balance extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ default: 0 })
  amount: number = 0;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Limit, { nullable: true })
  limit: Limit;

  @ManyToOne(() => Currency)
  currency: Currency;
}
