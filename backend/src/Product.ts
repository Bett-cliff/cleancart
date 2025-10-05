import mongoose from 'mongoose';

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  inStock: { type: Boolean, default: true },
}, {
  timestamps: true
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Initialize sample products if collection is empty
export const initializeProducts = async () => {
  const productCount = await Product.countDocuments();
  
  if (productCount === 0) {
    await Product.insertMany([
      {
        name: "Organic Cotton T-Shirt",
        description: "Comfortable and sustainable organic cotton t-shirt",
        price: 29.99,
        image: "/images/tshirt.jpg",
        category: "clothing",
        inStock: true
      },
      {
        name: "Eco-Friendly Water Bottle",
        description: "Reusable stainless steel water bottle",
        price: 24.99,
        image: "/images/bottle.jpg",
        category: "accessories",
        inStock: true
      },
      {
        name: "Bamboo Toothbrush",
        description: "Biodegradable bamboo toothbrush",
        price: 4.99,
        image: "/images/toothbrush.jpg",
        category: "personal-care",
        inStock: true
      }
    ]);
    console.log('✅ Sample products added to MongoDB');
  }
};