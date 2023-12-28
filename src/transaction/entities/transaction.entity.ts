import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

import { BasicEntity } from '../../common/basic-entity';
import { User } from '../../users/entities/user.entity';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Balance } from '../../balances/entities/balance.entity';
import { Target } from '../../target/entities/target.entity';

@Entity({
  repository: () => TransactionRepository,
  tableName: 'transactions',
})
export class Transaction extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @Property({ nullable: false })
  @ApiProperty()
  type: string;

  @Property({ nullable: false })
  @ApiProperty()
  amount: number;

  @Property({ nullable: false })
  @ApiProperty()
  balanceId: number;

  @Property({ nullable: false })
  @ApiProperty()
  userId: number;

  @Property({ nullable: false })
  @ApiProperty()
  targetId: number;

  @Property({ nullable: false })
  @ApiProperty()
  categoryId: number;

  @Property({ nullable: false })
  @ApiProperty()
  ignore: boolean;

  @ManyToOne(() => Balance)
  balance: Balance;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Target)
  target: Target;

  // @ManyToOne(() => Category)
  // category: Category;
}
