import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database";

// Routes
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/orders";
import customerOrdersRoutes from "./routes/customerOrders";  // Add this line

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Database connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customer-orders", customerOrdersRoutes);  // Add this line

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
      customerOrders: "/api/customer-orders/customer/:customerId, /api/customer-orders/vendor/:vendorId",  // Add this line
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
  console.log(`👤 Customer Orders: http://localhost:${PORT}/api/customer-orders`);  // Add this line
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});