import { IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  product: string;

  @IsNotEmpty()
  trader: string;

  @IsEmpty()
  position: number;
}
