import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto'

import { User } from '../../interfaces/user.interface';
import { UserSafeDataDto } from './dtos/userSafeData.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async new(@Body() userDto: UserDto): Promise<UserSafeDataDto> {
    return await this.userService.create(userDto);
  }


}
