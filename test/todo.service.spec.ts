import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
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

});

