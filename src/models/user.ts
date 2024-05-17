import { Document, Schema, Model, model, Types } from 'mongoose';

interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    country: string;
    posts: Types.ObjectId[]; // Reference to Post model
}

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post' // Reference to Post model
        }
    ]
});

const User: Model<IUser> = model('User', userSchema);

export { IUser, User };