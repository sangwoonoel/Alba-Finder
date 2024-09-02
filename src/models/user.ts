import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  nickname: string;
  mannerTemperature: number;
  isVerified: boolean;
  representativeName: string;
  companyName: string;
  businessRegistrationNumber: string;
}

const userSchema = new Schema<IUser>({
  nickname: { type: String, required: true },
  mannerTemperature: { type: Number, required: true },
  isVerified: { type: Boolean, required: true },
  representativeName: { type: String, required: true },
  companyName: { type: String, required: true },
  businessRegistrationNumber: { type: String, required: true },
});

export const User = model<IUser>('User', userSchema);