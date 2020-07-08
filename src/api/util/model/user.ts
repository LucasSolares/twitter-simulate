import { model, Schema, Document } from 'mongoose';

export interface User extends Document {
    name: string,
    lastname: string,
    dateOfBorn: Date,
    age?: number
}

const UserSchema = new Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true},
    dateOfBorn: { type: Date, required: true },
    age: { type: Number, required: true }
})

export default model<User>('user', UserSchema)
