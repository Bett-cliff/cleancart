import { Product, ProductVariant } from './product-types';

// Mock product data for demonstration
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Eco-Friendly All-Purpose Cleaner',
    description: 'Natural cleaning solution safe for all surfaces. Made from plant-based ingredients.',
    category: 'household-cleaners',
    brand: 'EcoClean',
    vendor: 'Green Solutions Kenya',
    vendorId: 'vendor-1',
    price: 850,
    originalPrice: 1000,
    images: [
      '/placeholder-cleaner.jpg',
      '/placeholder-cleaner-2.jpg'
    ],
    variants: [
      {
        id: '1-500ml',
        name: '500ml Bottle',
        price: 850,
        originalPrice: 1000,
        stock: 50,
        attributes: { size: '500ml', quantity: '1 bottle' },
        sku: 'EC-500-001'
      },
      {
        id: '1-1l',
        name: '1L Refill',
        price: 1500,
        originalPrice: 1800,
        stock: 30,
        attributes: { size: '1L', quantity: '1 refill' },
        sku: 'EC-1L-001'
      }
    ],
    specifications: {
      'Ingredients': 'Plant-based, Biodegradable',
      'Scent': 'Lemon Fresh',
      'Surface Type': 'All surfaces',
      'Eco-Certification': 'Yes'
    },
    rating: 4.5,
    reviews: 128,
    stock: 80,
    badges: ['Eco-Friendly', 'Best Seller', 'New'],
    isFeatured: true,
    isEcoFriendly: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    vendorVerified: true,
    location: 'Nairobi',
    tags: ['eco-friendly', 'all-purpose', 'natural'],
    shipping: {
      freeShipping: true,
      deliveryTime: '1-2 days',
      pickupAvailable: true
    }
  },
  {
    id: '2',
    name: 'Professional Pressure Washer',
    description: 'Heavy-duty pressure washer for industrial and commercial cleaning.',
    category: 'industrial-equipment',
    brand: 'PowerClean Pro',
    vendor: 'Industrial Clean Ltd',
    vendorId: 'vendor-2',
    price: 45000,
    originalPrice: 52000,
    images: [
      '/placeholder-pressure-washer.jpg'
    ],
    variants: [
      {
        id: '2-standard',
        name: 'Standard Model',
        price: 45000,
        originalPrice: 52000,
        stock: 15,
        attributes: { capacity: '2000 PSI', color: 'Blue' },
        sku: 'PC-2000-001'
      },
      {
        id: '2-premium',
        name: 'Premium Model',
        price: 65000,
        stock: 8,
        attributes: { capacity: '3000 PSI', color: 'Red' },
        sku: 'PC-3000-001'
      }
    ],
    specifications: {
      'Pressure': '2000-3000 PSI',
      'Motor Power': '2.5 HP',
      'Water Flow': '8 L/min',
      'Warranty': '2 years'
    },
    rating: 4.8,
    reviews: 89,
    stock: 23,
    badges: ['Professional', 'Heavy Duty', 'Popular'],
    isFeatured: true,
    isEcoFriendly: false,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    vendorVerified: true,
    location: 'Mombasa',
    tags: ['industrial', 'pressure-washer', 'commercial'],
    shipping: {
      freeShipping: false,
      deliveryTime: '3-5 days',
      pickupAvailable: true
    }
  }
];

// Utility functions
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.isFeatured);
};

export const getEcoFriendlyProducts = (): Product[] => {
  return mockProducts.filter(product => product.isEcoFriendly);
};

export const getVariantPrice = (product: Product, variantId?: string): number => {
  if (variantId) {
    const variant = product.variants.find(v => v.id === variantId);
    return variant?.price || product.price;
  }
  return product.price;
};

export const formatPrice = (price: number): string => {
  return `KSh ${price.toLocaleString()}`;
};

export const getProductStock = (product: Product, variantId?: string): number => {
  if (variantId) {
    const variant = product.variants.find(v => v.id === variantId);
    return variant?.stock || 0;
  }
  return product.stock;
};