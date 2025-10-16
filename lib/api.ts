const API_BASE_URL = '/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  products?: T[];
  product?: T;
  categories?: string[];
  total?: number;
  message?: string;
}

export async function fetchProducts(params?: {
  category?: string;
  search?: string;
}): Promise<ApiResponse<Product>> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append('category', params.category);
  if (params?.search) queryParams.append('search', params.search);

  const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export async function fetchProductById(id: string): Promise<ApiResponse<Product>> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  return response.json();
}

export async function fetchProductCategories(): Promise<ApiResponse<string>> {
  const response = await fetch(`${API_BASE_URL}/products/categories`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}