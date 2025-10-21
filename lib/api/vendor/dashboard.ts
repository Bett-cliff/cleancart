// lib/api/vendor/dashboard.ts
import { apiClient } from '../client';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  productsSold: number;
  newCustomers: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export interface PerformanceMetrics {
  conversionRate: number;
  averageOrderValue: number;
  customerSatisfaction: number;
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'customer' | 'review';
  message: string;
  time: string;
  amount?: number;
  status: 'success' | 'warning' | 'info';
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export interface SalesData {
  day: string;
  sales: number;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  performanceMetrics: PerformanceMetrics;
  recentActivity: RecentActivity[];
  topProducts: TopProduct[];
  salesData: SalesData[];
}

class VendorDashboardAPI {
  // Get complete dashboard data
  async getDashboardData(timeRange: string = '30d'): Promise<DashboardData> {
    const response = await apiClient.get(`/vendor/dashboard?range=${timeRange}`);
    return response.data; // Return the data from the response
  }

  // Get specific stats
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/vendor/dashboard/stats');
    return response.data;
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const response = await apiClient.get('/vendor/dashboard/metrics');
    return response.data;
  }

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    const response = await apiClient.get(`/vendor/dashboard/activity?limit=${limit}`);
    return response.data;
  }

  // Get top products
  async getTopProducts(limit: number = 5): Promise<TopProduct[]> {
    const response = await apiClient.get(`/vendor/dashboard/top-products?limit=${limit}`);
    return response.data;
  }

  // Get sales data for charts
  async getSalesData(range: string = '7d'): Promise<SalesData[]> {
    const response = await apiClient.get(`/vendor/dashboard/sales?range=${range}`);
    return response.data;
  }

  // Refresh dashboard data
  async refreshDashboard(): Promise<DashboardData> {
    const response = await apiClient.post('/vendor/dashboard');
    return response.data;
  }
}

export const vendorDashboardAPI = new VendorDashboardAPI();