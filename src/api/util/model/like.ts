import { model, Schema, Document } from 'mongoose';

export interface Like extends Document {
    relatedTo: string,
    createdBy: string,
    createdAt: Date
}

const LikeSchema = new Schema({
    relatedTo: { type: Schema.Types.ObjectId, required: true, ref: 'tweet'},
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    createdAt: { type: Date, required: true, default: new Date() }
})

export default model<Like>('like', LikeSchema)