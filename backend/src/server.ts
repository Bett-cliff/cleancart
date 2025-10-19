// backend/src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database";
import path from "path";
import fs from "fs";

// Routes
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/orders";
import customerOrdersRoutes from "./routes/customerOrders";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Database connection
connectDB();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

// Simple file upload endpoint
app.post("/api/upload", (req, res) => {
  // For now, we'll use base64 approach since file uploads are complex
  // In production, you'd want to use a service like Cloudinary or AWS S3
  res.json({
    success: true,
    message: "Use base64 image upload for development",
    note: "Images are stored as base64 strings in the database"
  });
});

// Serve static files from uploads directory
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customer-orders", customerOrdersRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 CleanCart Backend is running!",
    database: "Development mode - MongoDB optional",
    endpoints: {
      auth: "/api/auth/register, /api/auth/login",
      products: "/api/products, /api/products/:id",
      cart: "/api/cart/:userId",
      orders: "/api/orders, /api/orders/customer/:customerId, /api/orders/vendor/:vendorId",
      customerOrders: "/api/customer-orders/customer/:customerId, /api/customer-orders/vendor/:vendorId",
      upload: "/api/upload (base64 recommended for development)",
      health: "/api/health"
    }
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    database: "Development mode",
    message: "Backend fully functional - Add MongoDB when ready"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎯 Server running on http://localhost:${PORT}`);
  console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
  console.log(`🛍️ Product routes: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart routes: http://localhost:${PORT}/api/cart`);
  console.log(`📦 Order routes: http://localhost:${PORT}/api/orders`);
  console.log(`👤 Customer Orders: http://localhost:${PORT}/api/customer-orders`);
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/upload`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});