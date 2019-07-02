import { Controller, Get, Post, Body, UseGuards, Delete, Patch, Param } from '@nestjs/common';
import { TodoService } from '../providers/todo.service';
import { AuthGuard } from '@nestjs/passport';
import { newTodoDto } from '../dtos/newTodo.dto'
import { updateTodoDto } from '../dtos/updateTodo.dto';
import { createParamDecorator } from '@nestjs/common';
import { UserService } from '../providers/user.service';
import { User } from '../entities/user.entity';

export const Usr = createParamDecorator((data, req) => {
  return req.user;
});

//@UseInterceptors(CorsInterceptor)
@Controller('todo')
export class TodoController {
  constructor( 
    private readonly userService: UserService,
    private readonly todoService: TodoService,
  ) {}

// Ritorna DTO...
  @Get()
  @UseGuards(AuthGuard())
  async findAll(@Usr() user) {
    let usr = await this.userService.getUserById(user.id);
    return usr.todos;
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param() id: number, @Usr() user: User) {
    return this.todoService.getOne(id, user);
  }

  @Post() 
  @UseGuards(AuthGuard())
  create(@Body() todo: newTodoDto, @Usr() user: User) {
    return this.todoService.create(user, todo);

  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  delete(@Param() id: number, @Usr() user: User) {
    return this.todoService.delete(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(@Param() id: number, @Body() todo: updateTodoDto, @Usr() user) {
    return this.todoService.update(id, todo, user);
  }

}
