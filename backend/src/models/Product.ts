import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
  images: string[];
  vendorId: mongoose.Types.ObjectId;
  specifications: Array<{ key: string; value: string }>;
  weight?: number;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'active' | 'inactive';
  isEcoFriendly: boolean;
  isFeatured: boolean;
  variants: Array<{
    name: string;
    price: number;
    originalPrice?: number;
    stock: number;
    sku: string;
    attributes: {
      size?: string;
      color?: string;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  brand: { 
    type: String, 
    default: '' 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  originalPrice: { 
    type: Number,
    min: 0
  },
  stock: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0
  },
  sku: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  images: [{ 
    type: String 
  }],
  vendorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendor',
    required: true 
  },
  specifications: [{
    key: String,
    value: String
  }],
  weight: { 
    type: Number,
    min: 0
  },
  dimensions: {
    length: String,
    width: String,
    height: String
  },
  metaTitle: String,
  metaDescription: String,
  status: { 
    type: String, 
    enum: ['draft', 'active', 'inactive'],
    default: 'draft'
  },
  isEcoFriendly: { 
    type: Boolean, 
    default: false 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  variants: [{
    name: String,
    price: Number,
    originalPrice: Number,
    stock: Number,
    sku: String,
    attributes: {
      size: String,
      color: String
    }
  }]
}, {
  timestamps: true
});

// Create index for better query performance
productSchema.index({ vendorId: 1, status: 1 });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 }, { unique: true });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

// Initialize with CleanCart products (optional - for demo data)
export const initializeProducts = async () => {
  const productCount = await Product.countDocuments();
  
  if (productCount === 0) {
    console.log('🔄 Initializing demo products...');
    
    // You can keep your demo products here if needed, but they won't have vendorId
    // For now, we'll just log that the collection is empty
    console.log('📦 Product collection is ready for vendor products');
  } else {
    console.log(`✅ MongoDB already has ${productCount} products`);
  }
};