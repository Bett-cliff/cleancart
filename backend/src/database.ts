import { initializeProducts } from '../models/Product';  // Add this import

export const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
      console.log("✅ MongoDB connected successfully");
      
      // Initialize sample products
      await initializeProducts();  // Add this line
    }
  } catch (error) {
    console.log("❌ MongoDB connection failed - running in development mode");
  }
};