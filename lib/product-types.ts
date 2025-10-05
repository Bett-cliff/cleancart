export interface ProductVariant {
    id: string
    name: string
    price: number
    originalPrice?: number
    stock: number
    attributes: {
      size?: string
      color?: string
      quantity?: string
      capacity?: string
      [key: string]: string | undefined
    }
    sku: string
    image?: string
  }
  
  export interface Product {
    id: string
    name: string
    description: string
    category: string
    brand: string
    vendor: string
    vendorId: string
    price: number
    originalPrice?: number
    images: string[]
    variants: ProductVariant[]
    specifications: {
      [key: string]: string
    }
    rating: number
    reviews: number
    stock: number
    badges: string[]
    isFeatured: boolean
    isEcoFriendly: boolean
    createdAt: string
    updatedAt: string
    vendorVerified: boolean
    location: string
    tags: string[]
    shipping: {
      freeShipping: boolean
      deliveryTime: string
      pickupAvailable: boolean
    }
  }
  
  export interface WishlistItem {
    productId: string
    addedAt: string
    variantId?: string
  }
  
  export interface RecentlyViewedItem {
    productId: string
    viewedAt: string
  }
  
  export interface ComparisonItem {
    productId: string
    addedAt: string
  }