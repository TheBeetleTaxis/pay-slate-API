import mongoose, { Document, Schema } from 'mongoose';

export interface SlateUsers extends Document {
	email: string;
	phone: string;
	userName: string;
	password: string;
}

const UserSchema = new Schema({
    email: { type: String, require: true, unique: true },
	phone: { type: String, require: true },
    userName: { type: String, require: true },
	password: { type: String, require: true },
});

export default mongoose.model<SlateUsers>('User', UserSchema);