import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/app/users/users.service';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/app/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    let user: UserEntity;
    try {
      user = await this.usersService.findOneByEmail(email);
    } catch (error) {
      throw new UnauthorizedException();
    }

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
    };
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      token: this.jwtService.sign(payload),
    };
  }
}
