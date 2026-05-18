import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'Admin',
  SALES_USER = 'Sales User',
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.SALES_USER },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
