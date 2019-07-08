import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService) 
    {
        this.authService = authService;
    }
  async use(req: Request, res: Response, next: Function)  {
    if(req.headers.refresh) {
        await this.authService.refreshUserTokens(req.header("refresh")).then(tokens => {
            req.headers["authorization"] = "Bearer " + tokens.newToken;
            res.header("set-refresh", tokens.newRefreshToken);
            res.header("set-authorization", tokens.newToken);
            res.header("set-expiry", String(60 * 20));
            next();
        }).catch(e => {
            throw new HttpException("Error while refreshing the tokens", 500);
        })
    } else {
        next();
    }
  }
}

