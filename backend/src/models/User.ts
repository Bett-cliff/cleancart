import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// In-memory fallback for development
export const users: IUser[] = [];