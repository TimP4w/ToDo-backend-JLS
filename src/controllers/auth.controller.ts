import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../providers/auth.service';
import  { UserDto } from '../dtos/user.dto';

//@UseInterceptors(CorsInterceptor)
@Controller('auth/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() userDto: UserDto): Promise<any> {
    const token = await this.authService.signIn(userDto.username, userDto.password);
    return {token: token, expiresIn: 1}

  }

}
