import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the product to be ordered',
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
