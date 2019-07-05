import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { UserModule } from '../user/user.module';
//import { Todo } from '../entities/todo.entity'
import { PassportModule } from '@nestjs/passport';
import { TodoSchema } from './todo.schema';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserSchema } from '../user/user.schema';


@Module({
  imports: [
      //TypeOrmModule.forFeature([Todo]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      UserModule,
      MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }]),
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])

  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
