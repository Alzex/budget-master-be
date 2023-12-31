import { userMock } from './users.mock';
import { limitMock } from './limits.mock';
import { basicCrudMock } from './basic-crud.mock';

export const balancesServiceMock = {
  ...basicCrudMock,
  findAll: jest.fn(),
  findOneSafe: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

export const balanceMock = {
  id: 1,
  amount: 1000,
  user: userMock,
  limit: limitMock,
  currency: {
    id: 1,
    code: 'USD',
    name: 'US Dollar',
  },
};
