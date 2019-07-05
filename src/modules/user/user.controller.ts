import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto'

import { User } from '../../interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async new(@Body() userDto: UserDto): Promise<User> {
    return await this.userService.create(userDto);
  }


}
