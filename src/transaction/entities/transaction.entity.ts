import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BasicEntity } from '../../common/basic-entity';
import { TargetRepository } from '../repositories/target.repository';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity({ repository: () => TargetRepository })
export class Target extends BasicEntity {
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
  balnceId: number;

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

  @OneToOne(() => Target)
  target: Target;

  @ManyToOne(() => Category)
  category: Category;
}
