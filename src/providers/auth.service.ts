import { Injectable, UnauthorizedException } from '@nestjs/common';

/* Database */
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

/* JWT */
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}
    
    async getUserByUsernameAndPlainPassword(username: string, password: string): Promise<User> {
        let user = await this.userRepository.findOne({where: {username}});
        if (user && user.checkPassword(password)) {
            return user;
        } else {
          throw new UnauthorizedException();    
        }
    }

    async signIn(username: string, password: string): Promise<string> {
      return this.getUserByUsernameAndPlainPassword(username, password)
      .then(res => {
        const user: JwtPayload = { id: res.id, username: res.username};
        return this.jwtService.sign(user);
      })
      .catch(e => {
        throw new UnauthorizedException();    
      })

    }

    async validateUser(payload: JwtPayload): Promise<User> {
      const id = payload.id;
      return await this.userRepository.findOne({where: {id}});
    }

}
