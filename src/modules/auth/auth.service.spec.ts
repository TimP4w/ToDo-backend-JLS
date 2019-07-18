import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import  * as fs from 'fs';
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken';
import { HttpException } from '@nestjs/common';

let userModelMock = {
  findOne: (usr) => {
    return {
      _id: "id",
      username: "testUsername",
      password: bcrypt.hashSync("testPassword", 8),
    };
  },
  findOneAndUpdate: (id, property) => { 
    let user = { todos: [ 
                      "abc1",
                      "abc2",
                    ],
            _id: "idtest",
            username: 'test',
            password: 'testPassword',
            refreshToken: 'testRefreshToken',
            createdAt: "0000-00-00T00:00:00.000Z",
            updatedAt: "0000-00-00T00:00:00.000Z",
            __v: 21 
          }
    user.refreshToken = property.$set.refreshToken;
    return user;
  }
};

describe('AuthService', () => {
  let authController: AuthController;
  let authService: AuthService;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
        imports: [
          JwtModule.register({
            privateKey: fs.readFileSync("./keys/jwt.private.key"),
            signOptions: {
              algorithm: 'RS512',
              expiresIn: 60 * 20,
            },
          },),
        ],
        controllers: [AuthController],
        providers: [AuthService,
          {
            provide: getModelToken('User'),
            useValue: userModelMock
          }],
      }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });
  
  describe('signIn', () => {

      it('Should return a valid token', async () => {
          let login = await authService.signIn("testUsername", "testPassword");
          expect(jwt.decode(login.jwtToken)['username']).toBe("testUsername")
      });

      it('Should return the right expiry time', async () => {
        let login = await authService.signIn("testUsername", "testPassword");
        expect(login.expiresIn).toBe(1200)
      });

      it('Should throw exception on missing username', async () => {
          await authService.signIn("", "testPassword").catch(e => expect(e.response).toMatch(/empty/))
      });

      it('Should throw exception on missing password', async () => {
        await authService.signIn("testusername", "").catch(e => expect(e.response).toMatch(/empty/))
      });

      it('Should throw Unauthorized exception', async () => {
        await authService.signIn("testUsername", "abc").catch(e => expect(e.response.error).toMatch(/Unauthorized/))
      });

      it('Should throw Unauthorized exception', async () => {
        await authService.signIn("abc", "abc").catch(e => expect(e.response.error).toMatch(/Unauthorized/))
      });

  })
})