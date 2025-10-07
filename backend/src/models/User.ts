import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'vendor', 'customer'],
    default: 'customer'
  },
  // Vendor-specific fields
  businessName: {
    type: String,
    required: function() { return this.role === 'vendor'; }
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  businessDescription: {
    type: String,
    default: ''
  },
  businessType: {
    type: String,
    default: 'general'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);