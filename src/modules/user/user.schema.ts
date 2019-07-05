import * as mongoose from 'mongoose';


let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    todos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}]
});

userSchema.pre('save', function (next) {
    this.updatedAt = new Date();   
    return next();
});

export const UserSchema = userSchema;
