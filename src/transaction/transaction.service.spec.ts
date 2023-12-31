import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheService } from '../cache/cache.service';
import { UsersService } from '../users/users.service';
import { userMock, usersServiceMock } from '../common/mocks/users.mock';
import { EntityManager } from '@mikro-orm/core';
import { BalancesService } from '../balances/balances.service';
import { balancesServiceMock } from '../common/mocks/balances.mock';
import { TransactionType } from './enums/transaction-type.enum';
import { BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './repositories/transaction.repository';
import { CategoryService } from '../category/category.service';
import { TargetService } from '../target/target.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let balancesService: BalancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        TransactionService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: TransactionRepository,
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
        {
          provide: CacheService,
          useValue: null,
        },
        {
          provide: BalancesService,
          useValue: balancesServiceMock,
        },
        {
          provide: CategoryService,
          useValue: null,
        },
        {
          provide: TargetService,
          useValue: null,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    balancesService = module.get<BalancesService>(BalancesService);
  });

  it('Should throw error when limit exceeded or no more funds', async () => {
    const dto = {
      type: TransactionType.DEBIT,
      amount: 150,
      balanceId: 1,
      ignoreLimit: false,
    } as CreateTransactionDto;
    const meta = {
      userId: userMock.id,
      userRole: userMock.role,
      userEmail: userMock.email,
    };

    (balancesService.findOneSafe as jest.Mock).mockResolvedValueOnce({
      id: dto.balanceId,
      amount: 100,
      limit: { maxLoss: 100 },
    });

    await expect(service.create(dto, meta)).rejects.toThrow(
      BadRequestException,
    );
  });
});
