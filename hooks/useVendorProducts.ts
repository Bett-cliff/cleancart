import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  category: string;
  image: string;
  rating: number;
  orders: number;
  createdAt: string;
}

interface ProductsStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
}

interface ProductsResponse {
  data: {
    products: Product[];
    stats: ProductsStats;
  };
}

// Fetch vendor products with filters
export const useVendorProducts = (filters: { search: string; category: string; status: string }) => {
  return useQuery({
    queryKey: ['vendor-products', filters],
    queryFn: async (): Promise<ProductsResponse['data']> => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.status !== 'all') params.append('status', filters.status);

      const response = await fetch(`/api/vendor/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const result = await response.json();
      return result.data;
    },
    staleTime: 10000, // 10 seconds
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          productId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
    },
  });
};

// Archive product mutation
export const useArchiveProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'archive',
          productId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to archive product');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
    },
  });
};