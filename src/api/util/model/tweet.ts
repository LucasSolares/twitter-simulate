import { model, Schema, Document } from 'mongoose';

export interface Tweet extends Document {
    content: string,
    user: string,
    createdAt: Date,
}

const TweetSchema = new Schema({
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    createdAt: { type: Date, required: true, default: new Date() }
})

export default model<Tweet>('tweet', TweetSchema)
