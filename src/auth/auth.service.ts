import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.passwordHash))) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.role ? [user.role] : [],
    };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
    };
  }
}
