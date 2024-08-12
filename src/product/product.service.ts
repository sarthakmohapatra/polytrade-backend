import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from '@prisma/client';

interface PaginationOptions {
  page?: number;
  limit?: number;
}

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    userId: number,
    userRole: Role,
  ) {
    try {
      if (userRole !== Role.ADMIN) {
        this.logger.warn(
          `User ${userId} with role ${userRole} attempted to create a product`,
        );
        throw new ForbiddenException('Only admins can add products');
      }

      this.logger.log(
        `User ${userId} is creating a product: ${createProductDto.name}`,
      );
      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
        },
      });
      this.logger.log(`Product created successfully: ${createProductDto.name}`);
      return product;
    } catch (error) {
      this.logger.error(
        `Failed to create product for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(options: PaginationOptions = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    try {
      this.logger.log(
        `Fetching products with pagination - Page: ${page}, Limit: ${limit}`,
      );
      const products = await this.prisma.product.findMany({
        skip,
        take: limit,
      });
      this.logger.log(`Fetched ${products.length} products successfully`);
      return products;
    } catch (error) {
      this.logger.error(
        `Failed to fetch products: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      this.logger.log(`Fetching product with ID: ${id}`);
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!product) {
        this.logger.warn(`Product with ID ${id} not found`);
      } else {
        this.logger.log(`Product with ID ${id} fetched successfully`);
      }
      return product;
    } catch (error) {
      this.logger.error(
        `Failed to fetch product with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto, userRole: Role) {
    try {
      if (userRole !== Role.ADMIN) {
        this.logger.warn(
          `User attempted to update product ${id} without admin privileges`,
        );
        throw new ForbiddenException('Only admins can update products');
      }

      this.logger.log(`Updating product with ID: ${id}`);
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
      this.logger.log(`Product with ID ${id} updated successfully`);
      return updatedProduct;
    } catch (error) {
      this.logger.error(
        `Failed to update product with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number, userRole: Role) {
    try {
      if (userRole !== Role.ADMIN) {
        this.logger.warn(
          `User attempted to delete product ${id} without admin privileges`,
        );
        throw new ForbiddenException('Only admins can delete products');
      }

      this.logger.log(`Deleting product with ID: ${id}`);
      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });
      this.logger.log(`Product with ID ${id} deleted successfully`);
      return deletedProduct;
    } catch (error) {
      this.logger.error(
        `Failed to delete product with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
