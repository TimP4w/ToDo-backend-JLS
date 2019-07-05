import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication, HttpService, HttpModule } from '@nestjs/common';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const testAppModule: TestingModule = await Test.createTestingModule({
            imports: [HttpModule, AppModule]
        }).compile();

        app = testAppModule.createNestApplication();
        await app.init();
    });
 
    it('throws error if POST request does not include username', async () => {
        const mockUser = {
            "username": "",
            "password": "123"
        }
        return request(app.getHttpServer())
          .post('/user')
          .send(mockUser)
          .expect(400);
    });

    it('throws error if POST request does not include password', async () => {
        const mockUser = {
            "username": "test",
            "password": ""
        }
        return request(app.getHttpServer())
          .post('/user')
          .send(mockUser)
          .expect(400);
    });
});

