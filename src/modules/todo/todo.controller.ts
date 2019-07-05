import { Controller, Get, Post, Body, UseGuards, Delete, Patch, Param } from '@nestjs/common';
import { TodoService } from './todo.service';
import { AuthGuard } from '@nestjs/passport';
import { createTodoDto } from './dtos/createTodo.dto'
import { updateTodoDto } from './dtos/updateTodo.dto';
import { createParamDecorator } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Todo } from '../../interfaces/todo.interface';
import { UserJwtDto } from '../user/dtos/userJwt.dto';

export const Usr = createParamDecorator((data, req) => {
  return req.user;
});

//@UseInterceptors(CorsInterceptor)
@Controller('')
export class TodoController {
  constructor( 
    private readonly userService: UserService,
    private readonly todoService: TodoService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  async findAll(@Usr() user: UserJwtDto) {
    return this.todoService.getAll(user);
  }

  @Post() 
  @UseGuards(AuthGuard())
  create(@Body() todo: createTodoDto, @Usr() user: UserJwtDto): Promise<Todo> {
    return this.todoService.create(user, todo);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param() id: {id: string}, @Usr() user: UserJwtDto): Promise<Todo> {
    return this.todoService.getOne(id.id, user); // WTF? id is an object {id: id}
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  delete(@Param() id: {id: string}, @Usr() user: UserJwtDto): Promise<Todo> {
    return this.todoService.delete(id.id, user);
  }
  
  @Patch(':id')
  @UseGuards(AuthGuard())
  update(@Param() id: {id: string}, @Body() todo: updateTodoDto, @Usr() user: UserJwtDto): Promise<Todo> {
    return this.todoService.update(id.id, todo, user);
  } 

}
