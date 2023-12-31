import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { userMock, usersServiceMock } from '../common/mocks/users.mock';
import { SignUpDto } from './dto/sign-up.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwt: string;

  const positiveTestReq = {
    email: userMock.email,
    password: 'user123456',
  } as SignUpDto;

  const negativeTestReq = {
    email: 'any@sss.com',
    password: 'wwww',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should sign up user', async () => {
    (usersService.findOne as jest.Mock).mockResolvedValue(null);
    const result = await service.signup(positiveTestReq);

    expect(result).toEqual({
      success: true,
    });
  });

  it('should fail to sign in user if wrong credentials', async () => {
    service.signin(negativeTestReq).catch((e) => {
      expect(e).toBeDefined();
    });
  });

  it('should sign in user', async () => {
    (usersService.findOne as jest.Mock).mockResolvedValue(userMock);
    const result = await service.signin(positiveTestReq);

    expect(result).toEqual({
      accessToken: expect.any(String),
    });

    jwt = result.accessToken;
  });

  it('should verify and decode jwt', async () => {
    const result = await service.validate(jwt);

    expect(result).toEqual({
      sub: userMock.id,
      role: userMock.role,
      email: userMock.email,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
});
