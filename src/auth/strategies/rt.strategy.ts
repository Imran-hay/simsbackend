import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-ref') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKeyRefresh',
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any) {
    const refresh_token = req.headers.authorization.split(' ')[1];
    return { ...payload, refresh_token };
  }
}
