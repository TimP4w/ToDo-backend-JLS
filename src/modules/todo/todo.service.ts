import { Injectable, HttpException, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Todo } from '../../interfaces/todo.interface'
import { User } from '../../interfaces/user.interface';

import { createTodoDto } from './dtos/createTodo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserJwtDto } from '../user/dtos/userJwt.dto';
import { updateTodoDto } from './dtos/updateTodo.dto';
import { TodoDto } from './dtos/todo.dto';
import { TodoAndUserDto } from './dtos/todoAndUser.dto';


@Injectable()
export class TodoService {
    constructor(
        @InjectModel('Todo') private readonly todoModel: Model<Todo>,
        @InjectModel('User') private readonly userModel: Model<User>
    ) {}


    async create(user: UserJwtDto, todo: createTodoDto): Promise<TodoDto> {
        const createdTodo = new this.todoModel({
            title: todo.title,
            date: todo.date,
            user: user
        });
        await createdTodo.save((err, td) => {
            if(err) {
                throw new HttpException('Error while saving new todo', 500);
            }
            this.userModel.findOne( {_id: user._id} )
                .exec(function(err, user) {
                    if(err) {
                        throw new HttpException('Error while saving new todo', 500);
                    }
                    user.todos.push(createdTodo);
                    user.save(function(err) {
                        if(err) {
                            throw new HttpException('Error while saving new todo', 500);
                        }
                    });
                }) 
        })
        return createdTodo; 
    }

    async getAll(user: UserJwtDto): Promise<TodoDto[]> {
        let owner = await this.userModel.findOne(user).populate('todos').exec();
        return owner.todos;
    } 

    async getOne(id: string, user: UserJwtDto): Promise<TodoAndUserDto> {
        const task = await this.todoModel.findById(id).populate({path: 'user', select: 'username'}).exec();
        if (!task) {
            throw new HttpException('The task was not found', 404);
        } 
        if(task.user.username !== user.username) {
            throw new HttpException('You don\'t have the access to this resource', 401);
        }
        return task
    }
    
    async delete(id: string, user: UserJwtDto): Promise<TodoDto> {
        const task = await this.todoModel.findById(id).populate({path: 'user', select: 'username'}).exec();
        if (!task) {
            throw new HttpException('The task was not found', 404);
        } 
        if(task.user.username !== user.username) {
            throw new HttpException('You don\'t have the access to this resource', 401);
        }
        return task.remove();
    }

    async update(id: string, todo: updateTodoDto, user: UserJwtDto): Promise<TodoDto> {
        const task = await this.todoModel.findById(id).populate({path: 'user', select: 'username'}).exec();
        if (!task) {
            throw new HttpException('The task was not found', 404);
        } 
        if(task.user.username !== user.username) {
            throw new HttpException('You don\'t have the access to this resource', 401);
        }
        task.title = todo.title;
        task.date = todo.date;
        task.done = todo.done;
        return task.save();
    } 

}
