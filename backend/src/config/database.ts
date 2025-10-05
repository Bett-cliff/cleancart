import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initializeProducts } from '../models/Product';  // Add this import

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cleancart";

export const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
      console.log("✅ MongoDB connected successfully");
      
      // Initialize sample products - ADD THIS LINE
      await initializeProducts();
    }
  } catch (error) {
    console.log("❌ MongoDB connection failed - running in development mode");
  }
};