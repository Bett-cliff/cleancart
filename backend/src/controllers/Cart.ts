import mongoose from 'mongoose';

export interface ICartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

export interface ICart {
  _id?: string;
  userId: string;
  items: ICartItem[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: String,
    quantity: { type: Number, default: 1 },
    name: String,
    price: Number,
    image: String
  }],
  total: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

// In-memory fallback
export const carts: ICart[] = [];