import { wrap } from '@mikro-orm/core';

export class BasicEntity {
  toSafeEntity(ignoreFields: string[] = []): Partial<BasicEntity> {
    return wrap(this).toObject(ignoreFields);
  }
}
