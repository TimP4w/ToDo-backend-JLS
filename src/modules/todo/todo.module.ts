import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { TodoSchema } from './todo.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/user.schema';

@Module({
  imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
      UserModule,
      MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }]),
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])

  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {

}
