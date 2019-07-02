import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { UserDto } from '../dtos/user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async new(@Body() userDto: UserDto): Promise<any> {
    const user = await this.userService.create(userDto);
    return user; // Change this, only for test
  }

}
