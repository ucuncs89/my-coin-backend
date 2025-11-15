import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { KnexService } from '../../../database/knex.service';

export type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly knexService: KnexService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.knexService
      .client('user')
      .select('id', 'email', 'name')
      .where({ id: payload.sub })
      .whereNull('deleted_at')
      .first();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
