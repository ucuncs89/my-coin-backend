import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { KnexService } from '../../database/knex.service';
import { saltOrRounds } from '../../constant/saltOrRounds';
import { AppErrorException } from '../../exceptions/app-exceptions';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly knexService: KnexService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existingUser = await this.knexService
      .client('user')
      .where({ email })
      .whereNull('deleted_at')
      .first();

    if (existingUser) {
      throw new AppErrorException('Email already exists', 'EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const [user] = await this.knexService
      .client('user')
      .insert({
        email,
        password: hashedPassword,
        name,
      })
      .returning(['id', 'email', 'name', 'created_at']);

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      access_token: accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.knexService
      .client('user')
      .where({ email })
      .whereNull('deleted_at')
      .first();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      access_token: accessToken,
    };
  }
}
