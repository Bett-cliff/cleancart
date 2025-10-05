const API_BASE_URL = 'http://localhost:5000/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
}

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

export const apiService = {
  // Auth endpoints
  async register(userData: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    return handleResponse<AuthResponse>(response);
  },

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    return handleResponse<AuthResponse>(response);
  },

  // Product endpoints
  async getProducts(filters: { category?: string; search?: string } = {}): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
    return handleResponse<ProductsResponse>(response);
  },

  async getProductById(id: string): Promise<{ success: boolean; product: Product }> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse<{ success: boolean; product: Product }>(response);
  },

  async getCategories(): Promise<{ success: boolean; categories: string[] }> {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    return handleResponse<{ success: boolean; categories: string[] }>(response);
  },

  // Cart endpoints
  async getCart(userId: string): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
    return handleResponse<CartResponse>(response);
  },

  async addToCart(userId: string, productData: { productId: string; quantity?: number }): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/items`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    return handleResponse<CartResponse>(response);
  },

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/items/${productId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity })
    });
    return handleResponse<CartResponse>(response);
  },

  async removeFromCart(userId: string, productId: string): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/items/${productId}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
      }
    });
    return handleResponse<CartResponse>(response);
  },

  async clearCart(userId: string): Promise<CartResponse> {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/clear`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
      }
    });
    return handleResponse<CartResponse>(response);
  }
};

// Export individual functions for easier imports
export const { 
  register, 
  login, 
  getProducts, 
  getProductById, 
  getCategories,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = apiService;