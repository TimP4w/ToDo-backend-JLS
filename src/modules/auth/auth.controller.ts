import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import  { UserLoginDto } from '../user/dtos/userLogin.dto';
import { LoginDto } from './dtos/login.dto';

//@UseInterceptors(CorsInterceptor)
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() user: UserLoginDto): Promise<LoginDto> {
    try {
      const tokens = await this.authService.signIn(user.username, user.password);
      let response = {
        tokens, 
        expiresIn: 60 * 20 //20 min
      }
      return response;
    } catch(err) {
      console.log(err);
      throw new HttpException(err.response, err.status);
    }
  } 
}
