import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Product Name',
    description: 'The name of the product',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Product description',
    description: 'The description of the product',
    required: false,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 19.99, description: 'The price of the product' })
  @IsNumber()
  price: number;
}
