// lib/api/client.ts
class APIClient {
    private baseURL: string;
  
    constructor() {
      this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
    }
  
    private async request(endpoint: string, options: RequestInit = {}) {
      const url = `${this.baseURL}${endpoint}`;
      
      // Get auth token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('vendor_token') : null;
  
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };
  
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
  
      } catch (error) {
        console.error('API Request failed:', error);
        throw error;
      }
    }
  
    async get(endpoint: string) {
      return this.request(endpoint, { method: 'GET' });
    }
  
    async post(endpoint: string, data?: any) {
      return this.request(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
    }
  
    async put(endpoint: string, data?: any) {
      return this.request(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      });
    }
  
    async delete(endpoint: string) {
      return this.request(endpoint, { method: 'DELETE' });
    }
  }
  
  export const apiClient = new APIClient();