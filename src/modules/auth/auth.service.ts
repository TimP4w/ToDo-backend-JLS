import { Injectable, UnauthorizedException, HttpException, Inject, forwardRef } from '@nestjs/common';

/* Database */
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/* JWT */
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { User } from '../../interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { response } from 'express';
import { LoginDto } from '../auth/dtos/login.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel('User') private readonly userModel: Model<User>,
        //@Inject(forwardRef(() => UserService)) private readonly userService: AuthService
    ) {}

    generateToken(user: User): string {
      const jwtToken: JwtPayload = { id: user.id, username: user.username};
      let token =  this.jwtService.sign(jwtToken);
      return token
    }

    generateRefreshToken(username: string): string {
      const jwtRefreshToken = { username: username};
      let options = {
        expiresIn: "1y",
      }
      let refreshToken = this.jwtService.sign(jwtRefreshToken, options)
      return refreshToken;
    }
  
   async refreshUserTokens(refreshToken) {
      try {
        let user = await this.userModel.findOne({refreshToken: refreshToken});
        if(!user) {
          throw new UnauthorizedException();    
        }
        let newToken = this.generateToken(user);
        let newRefreshToken = this.generateRefreshToken(user.username);
        await this.userModel.update({username: user.username}, {$set: {'refreshToken': newRefreshToken}}).exec();
        return {newToken, newRefreshToken};
      } catch (err) {
          throw new HttpException("Something went wrong while refreshing the user tokens", 500);
      }  
    }

    async getUserByUsernameAndPlainPassword(username: string, password: string): Promise<User> {

      let user = await this.userModel.findOne({username: username});
      if(!user) {
        throw new HttpException("User not found", 404);
      }
      const checkPassword = bcrypt.compareSync(password, user.password);
      if (user && checkPassword) {
          return user;
      } else {
        throw new UnauthorizedException();    
      }
    }

    async signIn(username: string, password: string): Promise<LoginDto> {
      if(!username || !password) {
        throw new HttpException("Username and password cannot be empty", 400);
      }
      let jwtToken, refreshToken;
      let user = await this.getUserByUsernameAndPlainPassword(username, password);
      if (user) {
        jwtToken = this.generateToken(user);
        refreshToken = this.generateRefreshToken(user.username);
        try {
          await this.userModel.findOneAndUpdate({username: user.username}, {$set: {'refreshToken': refreshToken}});
          let tokens = {
            jwtToken, 
            refreshToken, 
            expiresIn: 60 * 20//20 min
          }
          return tokens;
        } catch(e) {
          throw new HttpException("Error while updating user refresh token", 500);
        }
      } else {
        throw new UnauthorizedException();    
      }
    }

    async validateUser(payload: JwtPayload): Promise<User> {
      const username = payload.username;
      try {
        return await this.userModel.findOne({username: username}).exec();
      } catch(e) {
        throw new HttpException("Error validating user", 500);
      }
    } 

}
