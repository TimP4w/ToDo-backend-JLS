import { Routes } from 'nest-router';
import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { TodoModule } from "./modules/todo/todo.module";
import { UserModule } from "./modules/user/user.module";

export const routes: Routes = [
    {
        path: '/api/v1',
        children: [
            {
                path: '/auth',
                module: AuthModule,
            },
            {
                path: '/todo',
                module: TodoModule,
            }
        ]
    }
];
