import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique, OneToMany, getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Todo } from './todo.entity';

@Entity()
@Unique(["username"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    @CreateDateColumn()
    creadetAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(type => Todo, todo => todo.user)
    todos: Todo[];

    public checkPassword(plainPassword: string): boolean {
        return bcrypt.compareSync(plainPassword, this.password);
    }

    static async getUserById(id: number): Promise<User> {
        return await getRepository(User).findOneOrFail(id, {relations: ["todos"]});
    }
}