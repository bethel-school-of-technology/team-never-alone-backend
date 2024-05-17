import { Document, Schema, Model, model, Types } from 'mongoose';

interface IPost extends Document {
    name: string;
    user: {
        _id: Types.ObjectId;
        username: string;
    } ;
}

const postSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
    }
});

const Post: Model<IPost> = model('Post', postSchema);

export { IPost, Post };