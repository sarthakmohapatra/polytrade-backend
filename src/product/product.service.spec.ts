import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, PrismaService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ForbiddenException if user role is not ADMIN', async () => {
      const createProductDto = { name: 'Test Product', price: 10.0 };
      await expect(service.create(createProductDto, 1, 'USER')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should create a product if user role is ADMIN', async () => {
      const createProductDto = { name: 'Test Product', price: 10.0 };

      jest.spyOn(prisma.product, 'create').mockResolvedValue({
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 10.0,
        createdAt: new Date(),
      });

      const result = await service.create(createProductDto, 1, 'ADMIN');
      expect(result).toHaveProperty('name', 'Test Product');
    });
  });
});
