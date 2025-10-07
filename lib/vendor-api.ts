const API_BASE_URL = 'http://localhost:5000/api'

export interface Vendor {
  _id: string
  businessName: string
  email: string
  phone: string
  address: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

class VendorApi {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  hasToken(): boolean {
    return this.token !== null
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    if (!this.token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers,
      },
    })

    if (response.status === 401) {
      this.clearToken()
      throw new Error('Authentication failed')
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/vendor/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data = await response.json()
    console.log('🔍 Login API response structure:', JSON.stringify(data, null, 2))
    return data
  }

  async verifyToken(): Promise<boolean> {
    try {
      await this.fetchWithAuth('/auth/vendor/verify')
      return true
    } catch (error) {
      return false
    }
  }

  async getDashboardStats() {
    return await this.fetchWithAuth('/vendor/dashboard/stats')
  }

  async getProducts() {
    return await this.fetchWithAuth('/vendor/products')
  }

  async getOrders() {
    return await this.fetchWithAuth('/vendor/orders')
  }
}

export const vendorApi = new VendorApi()