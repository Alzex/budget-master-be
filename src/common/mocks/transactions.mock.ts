import { TransactionType } from '../../transaction/enums/transaction-type.enum';
import { balanceMock } from './balances.mock';
import { userMock } from './users.mock';
import { targetMock } from './targets.mock';

export const transactionCreditMock = {
  id: 1,
  type: TransactionType.CREDIT,
  amount: 100,
  ignoreLimit: false,
  createdAt: new Date(),
  balance: balanceMock,
  user: userMock,
  target: targetMock,
  toSafeEntity: jest.fn(),
};

export const transactionDebitMock = {
  ...transactionCreditMock,
  id: 2,
  type: TransactionType.DEBIT,
};
