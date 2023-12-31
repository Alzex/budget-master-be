import { userMock } from './users.mock';

export const limitMock = {
  id: 1,
  name: 'Limit',
  description: 'Description',
  until: new Date(),
  maxLoss: 1000,
  user: userMock,
};
