import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRole } from '../enums/user-role.enum';
import { UserRepository } from '../repositories/user.repository';
import { BasicEntity } from '../../common/basic-entity';
import { ApiProperty } from '@nestjs/swagger';

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
}
