import * as mongoose from 'mongoose';

let todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: Boolean
    },
    date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    }, 
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

todoSchema.pre('save', function (next) {
    this.updatedAt = new Date();   
    return next();
});

export const TodoSchema = todoSchema;
