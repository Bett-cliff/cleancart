// hooks/useVendorDashboard.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { vendorDashboardAPI, DashboardData, DashboardStats, PerformanceMetrics, RecentActivity, TopProduct, SalesData } from '@/lib/api/vendor/dashboard';

// Fallback data in case API fails
const fallbackDashboardData: DashboardData = {
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
    productsSold: 0,
    newCustomers: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  },
  performanceMetrics: {
    conversionRate: 0,
    averageOrderValue: 0,
    customerSatisfaction: 0
  },
  recentActivity: [],
  topProducts: [],
  salesData: []
};

export const useVendorDashboard = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ['vendor-dashboard', timeRange],
    queryFn: async (): Promise<DashboardData> => {
      try {
        const data = await vendorDashboardAPI.getDashboardData(timeRange);
        return data;
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        return fallbackDashboardData;
      }
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });
};

export const useVendorStats = () => {
  return useQuery({
    queryKey: ['vendor-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      try {
        const data = await vendorDashboardAPI.getStats();
        return data;
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        return fallbackDashboardData.stats;
      }
    },
    refetchInterval: 15000,
  });
};

export const usePerformanceMetrics = () => {
  return useQuery({
    queryKey: ['vendor-metrics'],
    queryFn: async (): Promise<PerformanceMetrics> => {
      try {
        const data = await vendorDashboardAPI.getPerformanceMetrics();
        return data;
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        return fallbackDashboardData.performanceMetrics;
      }
    },
  });
};

export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: ['vendor-activity', limit],
    queryFn: async (): Promise<RecentActivity[]> => {
      try {
        const data = await vendorDashboardAPI.getRecentActivity(limit);
        return data;
      } catch (error) {
        console.error('Failed to fetch activity:', error);
        return fallbackDashboardData.recentActivity;
      }
    },
    refetchInterval: 10000,
  });
};

export const useTopProducts = (limit: number = 5) => {
  return useQuery({
    queryKey: ['vendor-top-products', limit],
    queryFn: async (): Promise<TopProduct[]> => {
      try {
        const data = await vendorDashboardAPI.getTopProducts(limit);
        return data;
      } catch (error) {
        console.error('Failed to fetch top products:', error);
        return fallbackDashboardData.topProducts;
      }
    },
  });
};

export const useSalesData = (range: string = '7d') => {
  return useQuery({
    queryKey: ['vendor-sales', range],
    queryFn: async (): Promise<SalesData[]> => {
      try {
        const data = await vendorDashboardAPI.getSalesData(range);
        return data;
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
        return fallbackDashboardData.salesData;
      }
    },
  });
};

// Refresh hook
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();
  
  return {
    refresh: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['vendor-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['vendor-stats'] }),
        queryClient.invalidateQueries({ queryKey: ['vendor-metrics'] }),
        queryClient.invalidateQueries({ queryKey: ['vendor-activity'] }),
        queryClient.invalidateQueries({ queryKey: ['vendor-top-products'] }),
        queryClient.invalidateQueries({ queryKey: ['vendor-sales'] }),
      ]);
    },
  };
};