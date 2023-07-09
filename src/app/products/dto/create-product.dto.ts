import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  owner: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  donation: boolean;
}
