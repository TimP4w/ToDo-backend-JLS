import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcryptjs";

import { User } from '../entities/user.entity';
import { UserDto } from '../dtos/user.dto';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(user: UserDto): Promise<User> {
        let newUser = {
            username: user.username,
            password: bcrypt.hashSync(user.password, 8)
        }; 
        return await this.userRepository.save(newUser);
    }

    async getUserById(id: number): Promise<User> {
        let user: User;
        user = await this.userRepository.findOne(id, {
            relations: ["todos"]
        });
        return user;
    }

}
