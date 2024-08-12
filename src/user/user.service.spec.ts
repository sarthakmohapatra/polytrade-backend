import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a user with the role USER', async () => {
      const createUserDto = {
        email: 'user@example.com',
        password: 'password123',
      };
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      jest.spyOn(prisma.user, 'create').mockResolvedValue({
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
        role: 'USER',
        createdAt: new Date(),
      });

      const result = await service.register(createUserDto);
      expect(result).toHaveProperty('role', 'USER');
    });
  });

  describe('onModuleInit', () => {
    it('should seed an admin user if not exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue({
        id: 1,
        email: 'admin@example.com',
        password: await bcrypt.hash('yourAdminPassword', 10),
        role: 'ADMIN',
        createdAt: new Date(),
      });

      await service.onModuleInit();
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ role: 'ADMIN' }),
      });
    });

    it('should not seed an admin user if already exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 1,
        email: 'admin@example.com',
        password: await bcrypt.hash('yourAdminPassword', 10),
        role: Role.ADMIN,
        createdAt: new Date(),
      });

      // Mock prisma.user.create as a spy
      const createSpy = jest.spyOn(prisma.user, 'create').mockResolvedValue({
        id: 1,
        email: 'admin@example.com',
        password: await bcrypt.hash('yourAdminPassword', 10),
        role: Role.ADMIN,
        createdAt: new Date(),
      });

      await service.onModuleInit();
      expect(createSpy).not.toHaveBeenCalled(); // Use the spy here
    });
  });
});
