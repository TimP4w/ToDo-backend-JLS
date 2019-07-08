import { User } from "./user.interface";
import * as mongoose from 'mongoose';

export interface Todo extends mongoose.Document {
    id: mongoose.Types.ObjectId,
    title: string,
    done: boolean,
    date: Date,
    updatedAt: Date,
    createdAt: Date,
    user: User
}