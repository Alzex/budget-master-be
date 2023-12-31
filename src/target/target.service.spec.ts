import { Test, TestingModule } from '@nestjs/testing';
import { TargetService } from './target.service';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { TransactionType } from '../transaction/enums/transaction-type.enum';
import { transactionCreditMock } from '../common/mocks/transactions.mock';
import { UsersService } from '../users/users.service';
import { TargetRepository } from './repositories/target.repository';
import { EntityManager } from '@mikro-orm/core';
import { usersServiceMock } from '../common/mocks/users.mock';
import { CacheService } from '../cache/cache.service';

describe('TargetService', () => {
  let service: TargetService;
  let eventEmitter: EventEmitter2;

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
          useValue: null,
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
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should handle transaction.credit event', async () => {
    const spy = jest.spyOn(service, 'onCreditEvent');

    await eventEmitter.emitAsync(TransactionType.CREDIT, transactionCreditMock);

    // 1 second delay is needed for the event to be handled
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(transactionCreditMock);
    }, 1000);
  });
});
