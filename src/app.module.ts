import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule, Route } from 'nest-router';
import { routes } from './routes';

import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { TodoModule } from './modules/todo/todo.module'

import { TypeOrmModule } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/todo'),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule, 
    UserModule,
    TodoModule,
    RouterModule.forRoutes(routes)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
