import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { RegexHelper } from 'src/helpers/regex.helper';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  @Matches(RegexHelper.cpf, { message: 'O campo informado não é um CPF' })
  cpf: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
