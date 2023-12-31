import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateLimitDto } from '../src/limits/dto/create-limit.dto';
import { CreateBalanceDto } from '../src/balances/dto/create-balance.dto';
import { CreateTargetDto } from '../src/target/dto/create-target.dto';
import { CreateTransactionDto } from '../src/transaction/dto/create-transaction.dto';
import { TransactionType } from '../src/transaction/enums/transaction-type.enum';

let accessToken: string;
let limitId: number;
let userId: number;
let balanceId: number;
let targetId: number;
let categoryId: number;

const currencyId = 1;
const maxLoss = 10000;

describe('Budget Master E2E Test', () => {
  let app: INestApplication;
  const fluctuation = Math.floor(Math.random() * 100000);
  const email = `test${fluctuation}@test.com`;
  const password = `test-pass${fluctuation}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Flow', () => {
    it('should sign up user', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email, password })
        .expect(201)
        .expect({
          success: true,
        });
    });

    it('should sign in user', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email, password })
        .expect(201)
        .expect((res) => {
          const { body } = res;

          expect(body).toHaveProperty('accessToken');
        });
    });
  });

  describe('Setup Flow', () => {
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email, password });

      accessToken = res.body.accessToken;
    });

    it("should return user's profile", () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          const { body } = res;

          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('email');
          expect(body.email).toEqual(email);
          expect(body).toHaveProperty('username');
          expect(body).toHaveProperty('role');

          userId = body.id;
        });
    });

    it('should create a limit', () => {
      return request(app.getHttpServer())
        .post('/limits')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Limit',
          maxLoss,
        } as CreateLimitDto)
        .expect(201)
        .expect((res) => {
          const { body } = res;

          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('name');
          expect(body.name).toEqual('Test Limit');
          expect(body).toHaveProperty('maxLoss');
          expect(body.maxLoss).toEqual(maxLoss);

          limitId = body.id;
        });
    });

    it('should create a balance', async () => {
      return request(app.getHttpServer())
        .post('/balances')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currencyId,
          limitId,
        } as CreateBalanceDto)
        .expect(201)
        .expect((res) => {
          const { body } = res;

          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('currency');
          expect(body.currency).toHaveProperty('id');
          expect(body).toHaveProperty('limit');
          expect(body.limit).toHaveProperty('id');
          expect(body).toHaveProperty('amount');
          expect(body.amount).toEqual(0);

          balanceId = body.id;
        });
    });

    it("should return all user's balances", async () => {
      return request(app.getHttpServer())
        .get('/balances')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          const { body } = res;

          expect(body).toBeInstanceOf(Array);
          expect(body.length).toEqual(1);
        });
    });

    it('should create target for smth', async () => {
      return request(app.getHttpServer())
        .post('/target')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Target',
          until: new Date(),
          targetQuantity: 100,
          description: 'Test Description',
        } as CreateTargetDto)
        .expect(201)
        .expect((res) => {
          const { body } = res;

          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('name');
          expect(body.name).toEqual('Test Target');
          expect(body).toHaveProperty('until');
          expect(body).toHaveProperty('targetQuantity');
          expect(body.targetQuantity).toEqual(100);
          expect(body).toHaveProperty('description');
          expect(body.description).toEqual('Test Description');

          targetId = body.id;
        });
    });

    it('should return all user targets', async () => {
      return request(app.getHttpServer())
        .get('/target')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          const { body } = res;

          expect(body).toBeInstanceOf(Array);
          expect(body.length).toEqual(1);
        });
    });
  });

  describe('Transaction Flow', () => {
    const amount = 100;

    it('[CREDIT] should create a transaction', async () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          amount,
          balanceId,
          targetId,
          type: TransactionType.CREDIT,
        } as CreateTransactionDto)
        .expect(201)
        .expect((res) => {
          const { body } = res;

          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('amount');
          expect(body.amount).toEqual(amount);
          expect(body).toHaveProperty('balance');
          expect(body.balance).toHaveProperty('id');
          expect(body).toHaveProperty('target');
          expect(body.target).toHaveProperty('id');
          expect(body).toHaveProperty('createdAt');
        });
    });

    it('[CREDIT] balance should be updated', async () => {
      return request(app.getHttpServer())
        .get(`/balances/${balanceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          const { body } = res;

          expect(body.amount).toEqual(amount);
        });
    });

    it('[CREDIT] target should be updated', async () => {
      return request(app.getHttpServer())
        .get(`/target/${targetId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          const { body } = res;

          expect(body.currentQuantity).toEqual(amount);
        });
    });

    it('[DEBIT] should create a transaction', async () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          amount,
          balanceId,
          targetId,
          type: TransactionType.DEBIT,
        } as CreateTransactionDto)
        .expect(201)
        .expect((res) => {
          const { body } = res;

          expect(body).toHaveProperty('id');
          expect(body).toHaveProperty('amount');
          expect(body.amount).toEqual(amount);
          expect(body).toHaveProperty('balance');
          expect(body.balance).toHaveProperty('id');
          expect(body).toHaveProperty('target');
          expect(body.target).toHaveProperty('id');
          expect(body).toHaveProperty('createdAt');
        });
    });

    it('[DEBIT] balance should be updated', async () => {
      return request(app.getHttpServer())
        .get(`/balances/${balanceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          const { body } = res;

          expect(body.amount).toEqual(0);
        });
    });

    it('[DEBIT] should fail if balance is not enough', async () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          amount: 1000000,
          balanceId,
          targetId,
          type: TransactionType.DEBIT,
        } as CreateTransactionDto)
        .expect(400);
    });
  });
});
