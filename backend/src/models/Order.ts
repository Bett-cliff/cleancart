// backend/src/models/Order.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for Order Item
export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendorId: Types.ObjectId;
}

// Interface for Shipping Address
export interface IShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  postalCode: string;
  additionalInfo?: string;
}

// Main Order Interface
export interface IOrder extends Document {
  orderNumber: string;
  customerId: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: 'mpesa' | 'card' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  mpesaReference?: string;
  transactionId?: string;
  vendorOrders: Array<{
    vendorId: Types.ObjectId;
    items: IOrderItem[];
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    shippingTracking?: string;
  }>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Schema
const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true }
});

const shippingAddressSchema = new Schema<IShippingAddress>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  county: { type: String, required: true },
  postalCode: { type: String, required: true },
  additionalInfo: { type: String }
});

const vendorOrderSchema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [orderItemSchema],
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingTracking: { type: String }
});

const orderSchema = new Schema<IOrder>({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: { 
    type: String, 
    enum: ['mpesa', 'card', 'cash_on_delivery'],
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  mpesaReference: { type: String },
  transactionId: { type: String },
  vendorOrders: [vendorOrderSchema],
  notes: { type: String }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 1000);
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Indexes for better query performance
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ 'vendorOrders.vendorId': 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderNumber: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);