import { Routes } from 'nest-router';
import { AuthModule } from "./modules/auth/auth.module";
import { TodoModule } from "./modules/todo/todo.module";

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
