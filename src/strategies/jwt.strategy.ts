import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../modules/auth/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '8bM@$D$NHp8ZS9BV*CXrt$heUtACoC7Y#7MGWC3oa*Kg5nB%r&cboxmv7XtEi^U@BD%8tt!#WsTqzL#T#w&I!V6q2I%gsFCR#InkpV2DS!cyoGfNjD*4QS9FDp499#@6',
    });
  }

  /* This validates the user based on the token */
  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}