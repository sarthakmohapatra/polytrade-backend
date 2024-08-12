import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

interface PaginationOptions {
  page?: number;
  limit?: number;
}

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    try {
      this.logger.log(
        `Creating order for user ${userId} with product ${createOrderDto.productId}`,
      );

      // Check if the product exists
      const product = await this.prisma.product.findUnique({
        where: { id: createOrderDto.productId },
      });

      if (!product) {
        this.logger.warn(
          `Product with ID ${createOrderDto.productId} not found`,
        );
        throw new NotFoundException(
          `Product with ID ${createOrderDto.productId} not found`,
        );
      }

      // Create the order
      const order = await this.prisma.order.create({
        data: {
          productId: createOrderDto.productId,
          userId,
        },
      });

      this.logger.log(
        `Order created successfully for user ${userId} with product ${createOrderDto.productId}`,
      );
      return order;
    } catch (error) {
      this.logger.error(
        `Failed to create order for user ${userId} with product ${createOrderDto.productId}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(userId: number, options: PaginationOptions = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    try {
      this.logger.log(
        `Fetching orders for user ${userId} with pagination - Page: ${page}, Limit: ${limit}`,
      );

      const orders = await this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
      });

      this.logger.log(`Successfully fetched orders for user ${userId}`);
      return orders;
    } catch (error) {
      this.logger.error(
        `Failed to fetch orders for user ${userId}`,
        error.stack,
      );
      throw error;
    }
  }
}
