import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { BasicEntity } from '../../common/basic-entity';
import { TargetRepository } from '../repositories/target.repository';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity({ repository: () => TargetRepository })
export class Target extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  @ApiProperty()
  id: number;

  @Property()
  @ApiProperty()
  name: string;

  @Property({ nullable: true })
  @ApiProperty()
  description?: string;

  @Property({ type: 'date', nullable: true })
  @ApiProperty({
    type: Date,
  })
  until: Date;

  @Property()
  @ApiProperty()
  targetQuantity: number;

  @Property()
  @ApiProperty()
  currentQuantity: number = 0;

  @ManyToOne(() => User)
  user: User;

  @Property({ type: 'date', onCreate: () => new Date() })
  createdAt: Date = new Date();
}
