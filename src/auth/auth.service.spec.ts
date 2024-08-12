import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user = {
        id: 1,
        email: 'user@example.com',
        password: 'password123',
        role: Role.USER, // Include the role
        createdAt: new Date(), // Include createdAt
      };

      // Mock the method that validates the user or any other related method
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);

      const token = 'signedToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(user);
      expect(result).toEqual({ access_token: token });
    });
  });
});
