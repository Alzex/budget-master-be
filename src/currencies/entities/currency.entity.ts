import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { CurrenciesRepository } from '../repositories/currencies.repository';
import { BasicEntity } from '../../common/basic-entity';

@Entity({
  tableName: 'currencies',
  repository: () => CurrenciesRepository,
})
export class Currency extends BasicEntity {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ length: 3, unique: true })
  code: string;

  @Property({ length: 255 })
  name: string;
}
