import { model, Schema, Document } from 'mongoose';

export interface Follower extends Document {
    follower: string,
    userFollowed: string,
    dateOfFollow: Date,
}

const FollowerSchema = new Schema({
    follower: { type: Schema.Types.ObjectId, required: true },
    userFollowed: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    dateOfFollow: { type: Date, required: true, default: new Date() }
})

export default model<Follower>('follower', FollowerSchema)