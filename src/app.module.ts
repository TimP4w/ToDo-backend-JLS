import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from 'nest-router';
import { routes } from './routes';

import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { TodoModule } from './modules/todo/todo.module'

import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenMiddleware } from './middlewares/refreshToken.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/todo'),
    AuthModule, 
    UserModule,
    TodoModule,
    RouterModule.forRoutes(routes)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RefreshTokenMiddleware)
      .forRoutes('');
  }
}
