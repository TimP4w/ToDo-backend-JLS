import { Injectable, HttpException, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Todo } from '../../interfaces/todo.interface'
import { User } from '../../interfaces/user.interface';

import { createTodoDto } from './dtos/createTodo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserJwtDto } from '../user/dtos/userJwt.dto';
import { updateTodoDto } from './dtos/updateTodo.dto';


@Injectable()
export class TodoService {
    constructor(
        @InjectModel('Todo') private readonly todoModel: Model<Todo>,
        @InjectModel('User') private readonly userModel: Model<User>
    ) {}


    async create(user: UserJwtDto, todo: createTodoDto): Promise<Todo> {
        try{
            const createdTodo = new this.todoModel({
                title: todo.title,
                date: todo.date,
                user: user
            });
            await createdTodo.save((err, td) => {
                this.userModel.findOne( {_id: user._id} )
                    .exec(function(err, user) {
                        user.todos.push(createdTodo);
                        user.save();
                    }) 
            })
            return createdTodo; // Todo, don't send back user data
        } catch (err) {
            console.log(err)
            throw new HttpException(err.response, err.status);
        }      
    }

    async getAll(user: UserJwtDto): Promise<Todo[]> {
        let owner = await this.userModel.findOne(user).populate('todos').exec();
        return owner.todos;
    } 

    async getOne(id: string, user: UserJwtDto): Promise<Todo> {
        try {
            const task = await this.todoModel.findById(id).populate({path: 'user', select: 'username'}).exec();
            if (!task) {
                throw new HttpException('The task was not found', 404);
            } 
            if(task.user.username !== user.username) {
                throw new HttpException('You don\'t have the access to this resource', 401);
            }
            return task
        } catch (err) {
            console.log(err)
            throw new HttpException(err.response, err.status);
        }       
    }
    
    async delete(id: string, user: UserJwtDto): Promise<Todo> {
        try {
            const task = await this.todoModel.findById(id).populate({path: 'user', select: 'username'}).exec();
            if (!task) {
                throw new HttpException('The task was not found', 404);
            } 
            if(task.user.username !== user.username) {
                throw new HttpException('You don\'t have the access to this resource', 401);
            }
            return task.remove();
        } catch (err) {
            console.log(err)
            throw new HttpException(err.response, err.status);
        }       
    }

    async update(id: string, todo: updateTodoDto, user: UserJwtDto): Promise<any> {
        try {
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
        } catch (err) {
            console.log(err)
            throw new HttpException(err.response, err.status);
        }  
    } 
}
