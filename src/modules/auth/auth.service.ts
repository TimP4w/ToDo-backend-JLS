import { Injectable, UnauthorizedException } from '@nestjs/common';

/* Database */
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

/* JWT */
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../interfaces/user.interface';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
    constructor(
        //@InjectRepository(User) private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        @InjectModel('User') private readonly userModel: Model<User>

    ) {}

    async getUserByUsernameAndPlainPassword(username: string, password: string): Promise<User> {
        let user = await this.userModel.findOne({username: username});
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (user && checkPassword) {
            return user;
        } else {
          throw new UnauthorizedException();    
        }
    }

    async signIn(username: string, password: string): Promise<string> {
      try {
        const res = await this.getUserByUsernameAndPlainPassword(username, password);
        const user: JwtPayload = { id: res.id, username: res.username };
        return this.jwtService.sign(user);
      }
      catch (e) {
        throw new UnauthorizedException();
      }
    }

    async validateUser(payload: JwtPayload): Promise<User> {
      const username = payload.username;
      return await this.userModel.findOne({username: username}).exec();

      //return await this.userRepository.findOne({where: {id}});
    } 

}
