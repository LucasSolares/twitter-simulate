import { model, Schema, Document } from 'mongoose';

export interface Tweet extends Document {
    content?: string,
    user: string,
    relatedTo: string,
    createdAt: Date,
}

const TweetSchema = new Schema({
    content: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    relatedTo: { type: Schema.Types.String, required: false, ref: 'tweet' },
    createdAt: { type: Date, required: true, default: new Date() },
})

export default model<Tweet>('tweet', TweetSchema)
