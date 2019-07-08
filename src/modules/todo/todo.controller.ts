import { Controller, Get, Post, Body, UseGuards, Delete, Patch, Param, HttpException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { AuthGuard } from '@nestjs/passport';
import { createTodoDto } from './dtos/createTodo.dto'
import { updateTodoDto } from './dtos/updateTodo.dto';
import { createParamDecorator } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Todo } from '../../interfaces/todo.interface';
import { UserJwtDto } from '../user/dtos/userJwt.dto';
import { TodoDto } from './dtos/todo.dto';

//This gets the user from the payload via a custom decorator
export const Usr = createParamDecorator((data, req) => {
  return req.user;
});

@Controller('')
export class TodoController {
  constructor( 
    private readonly userService: UserService,
    private readonly todoService: TodoService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  async findAll(@Usr() user: UserJwtDto): Promise<TodoDto[]> {
    try {
      return this.todoService.getAll(user);
    } catch(e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Post() 
  @UseGuards(AuthGuard())
  create(@Body() todo: createTodoDto, @Usr() user: UserJwtDto): Promise<TodoDto> {
    try {

    } catch(e) {
      throw new HttpException(e.response, e.status);
    }
    return this.todoService.create(user, todo);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param() id: {id: string}, @Usr() user: UserJwtDto): Promise<TodoDto> {
    try {
      return this.todoService.getOne(id.id, user);
    } catch(e) {
      throw new HttpException(e.response, e.status);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  delete(@Param() id: {id: string}, @Usr() user: UserJwtDto): Promise<TodoDto> {
    try {
      return this.todoService.delete(id.id, user);
    } catch(e) {
      throw new HttpException(e.response, e.status);
    }
  }
  
  @Patch(':id')
  @UseGuards(AuthGuard())
  update(@Param() id: {id: string}, @Body() todo: updateTodoDto, @Usr() user: UserJwtDto): Promise<TodoDto> {
    try {
      return this.todoService.update(id.id, todo, user);
    } catch(e) {
      throw new HttpException(e.response, e.status);
    }
  } 

}
