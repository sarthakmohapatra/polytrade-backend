import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, PrismaService],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if product does not exist', async () => {
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(null);

      await expect(service.create({ productId: 1 }, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create an order if product exists', async () => {
      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue({
        id: 1,
        name: 'Test Product',
        description: 'Test description',
        price: 10.0,
        createdAt: new Date(),
      });

      jest.spyOn(prisma.order, 'create').mockResolvedValue({
        id: 1,
        userId: 1,
        productId: 1,
        createdAt: new Date(),
      });

      const result = await service.create({ productId: 1 }, 1);
      expect(result).toHaveProperty('productId', 1);
    });
  });
});
