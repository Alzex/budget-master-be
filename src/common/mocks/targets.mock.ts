import { basicCrudMock } from './basic-crud.mock';
import { userMock } from './users.mock';

export const targetsMock = {
  ...basicCrudMock,
  find: jest.fn(),
  findOneSafe: jest.fn(),
  createTarget: jest.fn(),
  updateTarget: jest.fn(),
};

export const targetMock = {
  id: 1,
  name: 'Target',
  description: 'Description',
  until: new Date(),
  targetQuantity: 1000,
  currentQuantity: 0,
  user: userMock,
};
