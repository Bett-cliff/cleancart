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

// Initialize with CleanCart products
export const initializeProducts = async () => {
  const productCount = await Product.countDocuments();
  
  if (productCount === 0) {
    await Product.insertMany([
      {
        name: "Floor Scrubbing Machine",
        description: "Professional floor scrubbing machine for commercial use",
        price: 32000,
        image: "/images/floor-scrubber.jpg",
        category: "industrial-equipment",
        inStock: true
      },
      {
        name: "Steam Cleaning System",
        description: "Eco-friendly steam cleaning system for various surfaces",
        price: 28500,
        image: "/images/steam-cleaner.jpg",
        category: "eco-friendly",
        inStock: true
      },
      {
        name: "Commercial Carpet Cleaner",
        description: "Heavy duty carpet cleaner for commercial spaces",
        price: 52000,
        image: "/images/carpet-cleaner.jpg",
        category: "industrial-equipment",
        inStock: true
      },
      {
        name: "Ultrasonic Parts Cleaner",
        description: "Precision ultrasonic parts cleaning system",
        price: 18500,
        image: "/images/ultrasonic-cleaner.jpg",
        category: "industrial-equipment",
        inStock: true
      },
      {
        name: "High-Pressure Steam Generator",
        description: "Industrial high-pressure steam cleaning system",
        price: 65000,
        image: "/images/steam-generator.jpg",
        category: "industrial-equipment",
        inStock: true
      },
      {
        name: "Automatic Floor Scrubber",
        description: "Automated floor scrubbing system for large areas",
        price: 120000,
        image: "/images/auto-scrubber.jpg",
        category: "industrial-equipment",
        inStock: true
      },
      {
        name: "Eco-Friendly All-Purpose Cleaner",
        description: "Natural all-purpose cleaner safe for families and environment",
        price: 450,
        image: "/images/all-purpose-cleaner.jpg",
        category: "household-cleaners",
        inStock: true
      },
      {
        name: "Biodegradable Dish Soap",
        description: "Eco-friendly dish soap that's gentle on hands",
        price: 320,
        image: "/images/dish-soap.jpg",
        category: "household-cleaners",
        inStock: true
      },
      {
        name: "Industrial Floor Cleaner",
        description: "Professional grade industrial floor cleaning solution",
        price: 1200,
        image: "/images/industrial-cleaner.jpg",
        category: "household-cleaners",
        inStock: true
      },
      {
        name: "Organic Glass Cleaner",
        description: "Eco-friendly glass cleaning solution",
        price: 380,
        image: "/images/glass-cleaner.jpg",
        category: "household-cleaners",
        inStock: true
      }
    ]);
    console.log('✅ CleanCart products added to MongoDB');
  } else {
    console.log(`✅ MongoDB already has ${productCount} products`);
  }
};