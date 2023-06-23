import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() userDto: AuthenticateUserDto) {
    return await this.authService.login(userDto.email, userDto.password);
  }
}
