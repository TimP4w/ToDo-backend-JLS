import { Injectable, HttpException, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';

import * as bcrypt from "bcryptjs";

import { User } from '../../interfaces/user.interface';
import { UserDto } from './dtos/user.dto';

import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
    constructor(
       // @InjectRepository(User) private userRepository: Repository<User>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService

    ) {}

    async create(user: UserDto): Promise<User> {
        if (!user.username || !user.password) {
            throw new HttpException('Username and password cannot be empty', 400);
        }

        let usr = await this.getUserByUsername(user.username);

        if(usr) {
            throw new HttpException('User already exists', 400);
        }

        let newUser = {
            username: user.username,
            password: bcrypt.hashSync(user.password, 8),
            refreshToken: this.authService.generateRefreshToken(user.username)
        }; 

        const createdUser = new this.userModel(newUser)
        return await createdUser.save();
    }

    async getUserByUsername(username: string): Promise<User> {
        let user: User;
        user = await this.userModel.findOne({username: username});
        return user;
    } 

}
