import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from '../controllers/todo.controller';
import { TodoService } from '../providers/todo.service';
import { UserModule } from '../modules/user.module';
import { Todo } from '../entities/todo.entity'
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
      TypeOrmModule.forFeature([Todo]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
      UserModule
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
