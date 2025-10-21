// backend/src/models/Vendor.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IVendor extends Document {
  businessName: string;
  businessEmail: string;
  phoneNumber: string;
  location: string;
  description?: string;
  specialties: string[];
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  joinedDate: Date;
  logo?: string;
  bannerImage?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  businessHours?: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  paymentMethods: string[];
  deliveryOptions: string[];
  minimumOrder: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  businessEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  specialties: [{
    type: String,
    trim: true
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  logo: {
    type: String
  },
  bannerImage: {
    type: String
  },
  website: {
    type: String,
    trim: true
  },
  socialMedia: {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true }
  },
  businessHours: {
    Monday: { type: String, default: '9:00 AM - 6:00 PM' },
    Tuesday: { type: String, default: '9:00 AM - 6:00 PM' },
    Wednesday: { type: String, default: '9:00 AM - 6:00 PM' },
    Thursday: { type: String, default: '9:00 AM - 6:00 PM' },
    Friday: { type: String, default: '9:00 AM - 6:00 PM' },
    Saturday: { type: String, default: '10:00 AM - 4:00 PM' },
    Sunday: { type: String, default: 'Closed' }
  },
  paymentMethods: [{
    type: String,
    enum: ['mpesa', 'card', 'cash_on_delivery', 'bank_transfer'],
    default: ['mpesa']
  }],
  deliveryOptions: [{
    type: String,
    enum: ['pickup', 'delivery', 'both'],
    default: ['delivery']
  }],
  minimumOrder: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes for better performance
vendorSchema.index({ businessName: 'text', description: 'text' });
vendorSchema.index({ location: 1 });
vendorSchema.index({ isVerified: 1 });
vendorSchema.index({ rating: -1 });
vendorSchema.index({ specialties: 1 });

// Virtual for average rating (if needed)
vendorSchema.virtual('averageRating').get(function() {
  return this.reviewCount > 0 ? this.rating / this.reviewCount : 0;
});

export const Vendor = mongoose.model<IVendor>('Vendor', vendorSchema);