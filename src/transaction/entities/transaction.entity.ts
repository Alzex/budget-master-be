import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

import { BasicEntity } from '../../common/basic-entity';
import { User } from '../../users/entities/user.entity';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Balance } from '../../balances/entities/balance.entity';
import { Target } from '../../target/entities/target.entity';
import { Category } from '../../category/entities/category.entity';
import { TransactionType } from '../enums/transaction-type.enum';

@Entity({
  repository: () => TransactionRepository,
  tableName: 'transactions',
})
export class Transaction extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @Enum(() => TransactionType)
  @ApiProperty()
  type: TransactionType;

  @Property({ nullable: false })
  @ApiProperty()
  amount: number;

  @Property({ default: false })
  @ApiProperty()
  ignoreLimit: boolean;

  @ManyToOne(() => Balance)
  balance: Balance;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Target, { nullable: true })
  target: Target;

  @ManyToOne(() => Category)
  category: Category;
}
