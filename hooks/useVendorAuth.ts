// hooks/useVendorAuth.ts
import { useState, useEffect } from 'react';

export function useVendorAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if vendor token exists
        const token = localStorage.getItem('vendor_token');
        
        if (token) {
          setIsAuthenticated(true);
        } else {
          // For development, set a mock token
          localStorage.setItem('vendor_token', 'demo-vendor-token-123');
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    isLoading
  };
}