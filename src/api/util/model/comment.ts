import { model, Schema, Document } from 'mongoose';

export interface Comment extends Document {
  createdBy: string,
  relatedTo: string,
  content: string,
  createdAt: Date
}

const CommentSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  relatedTo: { type: Schema.Types.String, required: false, ref: 'tweet' },
  content: { type: String, required: true },
  createdAt: { type: String, required: true, default: new Date() }
})

export default model<Comment>('comment', CommentSchema)
