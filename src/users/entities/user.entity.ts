import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserRole } from '../enums/user-role.enum';
import { UserRepository } from '../repositories/user.repository';
import { BasicEntity } from '../../common/basic-entity';
import { ApiProperty } from '@nestjs/swagger';
import { Balance } from '../../balances/entities/balance.entity';
import { Limit } from '../../limits/entities/limit.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity({ repository: () => UserRepository })
export class User extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @Property({ unique: true })
  @ApiProperty()
  email: string;

  @Property({ nullable: true })
  @ApiProperty()
  username?: string;

  @Enum(() => UserRole)
  @ApiProperty({
    enum: UserRole,
  })
  role: UserRole;

  @Property({ hidden: true })
  passwordHash: string;

  @Property({ hidden: true })
  passwordSalt: string;

  @Property({ type: 'date' })
  @ApiProperty({
    type: Date,
  })
  createdAt: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  @ApiProperty({
    type: Date,
  })
  updatedAt: Date = new Date();

  @OneToMany(() => Balance, (balance) => balance.user)
  balances = new Collection<Balance>(this);

  @OneToMany(() => Limit, (lim) => lim.user)
  limits = new Collection<Limit>(this);

  @OneToMany(() => Transaction, (trx) => trx.user)
  transactions = new Collection<Transaction>(this);
}
