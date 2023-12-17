import { wrap } from '@mikro-orm/core';

export class BasicEntity {
  toSafeEntity(ignoreFields: Array<keyof this> = []): Partial<BasicEntity> {
    return wrap(this).toObject(ignoreFields as string[]);
  }
}
