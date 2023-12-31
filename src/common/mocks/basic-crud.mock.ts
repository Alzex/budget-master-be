export const basicCrudMock = {
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  findOneCached: jest.fn(),
  findMany: jest.fn(),
  findManyCached: jest.fn(),
  upsert: jest.fn(),
  delete: jest.fn(),
  flushCrudCache: jest.fn(),
  createOne: jest.fn(),
};
