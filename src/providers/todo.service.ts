import { Injectable, HttpException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Todo } from '../entities/todo.entity';
import { User } from '../entities/user.entity';


import { updateTodoDto } from '../dtos/updateTodo.dto';
import { newTodoDto } from '../dtos/newTodo.dto';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>
    ) {}


    async create(user: User, todo: newTodoDto): Promise<Todo> {
        let newTodo = new Todo();
        newTodo.user = user;
        newTodo.title = todo.title;
        newTodo.date = todo.date;
        return await this.todoRepository.save(newTodo);
    }

    async getAll(user: User): Promise<Todo[]> {
        return await user.todos;
    } 

    async getOne(id: number, user: User): Promise<Todo> {
        // Check that is owner
        const task = await this.todoRepository.findOne(id);
        if (!task) {
            throw new HttpException('The task was not found', 404);
        } 
        return task
    }

    async delete(id: number, user: User): Promise<Todo> {
        // Check that is owner
        const task = await this.todoRepository.findOne(id);
        if (task) {
            console.log(task);
            return await this.todoRepository.remove(task);
        } else {
            throw new HttpException('The task was not found', 404);
        }
    }

    async update(id: number, todo: updateTodoDto, user: User): Promise<any> {
        // Check that is owner
        const task = await this.todoRepository.findOne(id);
        if (task) {
            return await this.todoRepository.update(id, todo);
        } else {
            throw new HttpException('The task was not found', 404);
        }
    }





}
