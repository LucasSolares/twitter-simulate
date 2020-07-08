import { model, Schema, Document } from 'mongoose';

export interface Auth extends Document {
    email: string,
    password: string,
    createdAt?: Date,
    user?: string
}

const AuthSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true, default: new Date() },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'user' }
})

export default model<Auth>('auth', AuthSchema)
