import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
	companyName: string;
	phone: string;
	email: string;
	password: string;
}

const CompanySchema = new Schema({
	companyName: { type: String, require: true },
	phone: { type: String, require: true },
	email: { type: String, require: true, unique: true },
	password: { type: String, require: true },
});



export interface IDocuments extends Document {
	businessCategory: string;
	cacCertificate: string;
	address: string;
	city: string;
    state: string;
}

const companyDataSchema = new Schema<IDocuments>(
    {
      businessCategory: { type: String, default: 'School', enum: ['School', 'Hospital', 'Security', 'Supermarket', 'Shops', 'Vendor', 'Others']},
      cacCertificate: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
     
    },
    { _id: false, timestamps: true}
   
  );
  

export default mongoose.model<ICompany>('Company', CompanySchema, 'companyData');


