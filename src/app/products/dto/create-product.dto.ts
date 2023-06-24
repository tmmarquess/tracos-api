import { IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/app/users/user.entity';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  owner: UserEntity;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  donation: boolean;
}
