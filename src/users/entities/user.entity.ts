import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRole } from '../enums/user-role.enum';
import { UserRepository } from '../repositories/user.repository';

@Entity({ repository: () => UserRepository })
export class User {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ unique: true })
  email: string;

  @Property({ nullable: true })
  username?: string;

  @Enum(() => UserRole)
  role: UserRole;

  @Property({ hidden: true })
  password_hash: string;

  @Property({ hidden: true })
  password_salt: string;

  @Property({ type: 'date' })
  created_at: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  updated_at: Date = new Date();
}
