import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import  * as fs from 'fs';

let userModelMock = {};

describe('AuthController', () => {
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
  
  describe('login', () => {
      it('should call the signIn method with username and password', async () => {
          const tokens = {
                  jwtToken: "abc",
                  refreshToken: "abc",
                  expiresIn: 1200
          };
          
          const spy = jest.spyOn(authService, 'signIn').mockImplementation(() => Promise.resolve(tokens));
          await authController.login({username: "testUsername", password: "testPassword"});
          expect(spy).toHaveBeenCalledWith("testUsername", "testPassword");
      });

      it('should return the jwt tokens', async () => {
        const tokens = {
                jwtToken: "abc",
                refreshToken: "abc",
                expiresIn: 1200
        };
        
        jest.spyOn(authService, 'signIn').mockImplementation(() => Promise.resolve(tokens));
        expect(await authController.login({username: "test", password: "test"})).toBe(tokens);
      });

/*       it('should return error on promise rejection', async () => {
        let error = {
          response: "an error",
          status: 500
        } 
        let exception = new HttpException(error.response, error.status);
        jest.spyOn(authService, 'signIn').mockImplementation(() => Promise.reject(error));
        expect(await authController.login({username: "test", password: "test"})).rejects.toThrowError();
        
    }); */

  })
})