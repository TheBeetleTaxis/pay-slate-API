import mongoose, { Document, Schema } from 'mongoose';

export interface ISchool extends Document {
	name: string;
	phone: string;
	email: string;
	cac: number;
	password: string;
}

const SchoolSchema = new Schema({
	name: { type: String, require: true },
	phone: { type: String, require: true },
	email: { type: String, require: true, unique: true },
	cac: { type: Number, require: true, unique: true },
	password: { type: String, require: true },
	
});


export default mongoose.model<ISchool>('School', SchoolSchema);
