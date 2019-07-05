import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import  { UserLoginDto } from '../user/dtos/userLogin.dto';

//@UseInterceptors(CorsInterceptor)
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() user: UserLoginDto): Promise<any> {
    const token = await this.authService.signIn(user.username, user.password);
    let response = {
      token: token, 
      expiresIn: 1
    }
    return response;
  } 

}
