import { Test, TestingModule } from '@nestjs/testing';
import { TargetService } from './target.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { transactionCreditMock } from '../common/mocks/transactions.mock';
import { UsersService } from '../users/users.service';
import { TargetRepository } from './repositories/target.repository';
import { EntityManager } from '@mikro-orm/core';
import { usersServiceMock } from '../common/mocks/users.mock';
import { CacheService } from '../cache/cache.service';

describe('TargetService', () => {
  let service: TargetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        TargetService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: TargetRepository,
          useValue: {
            updateOne: jest.fn(),
            findOneOrFail: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            persistAndFlush: jest.fn(),
          },
        },
        {
          provide: EntityManager,
          useValue: null,
        },
        {
          provide: CacheService,
          useValue: null,
        },
      ],
    }).compile();

    service = module.get<TargetService>(TargetService);
    service.updateOne = jest.fn();
  });

  it('should handle transaction.credit event', async () => {
    const trx = transactionCreditMock;
    const expected = trx.amount + trx.target.currentQuantity;

    (service.updateOne as jest.Mock).mockResolvedValueOnce(trx.target);

    // @ts-ignore
    const affected = await service.onCreditEvent(trx);

    await expect(affected.currentQuantity).toEqual(expected);
  });
});
