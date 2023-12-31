import { basicCrudMock } from './basic-crud.mock';
import { UserRole } from '../../users/enums/user-role.enum';

export const usersServiceMock = {
  ...basicCrudMock,
  findOneByIdSafe: jest.fn(),
  complexSearch: jest.fn(),
  calculateAnalytics: jest.fn(),
};

export const userMock = {
  id: 1,
  email: 'test@twit.com',
  username: 'test',
  role: UserRole.USER,
  passwordHash: '$2b$10$vkg45IxjfQbn7tbZJ5x5pO5f1Gaz1QBCFQdi721RmmLEF3nVrzSNm',
};
