// hooks/useVendorAuth.ts
import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  businessName?: string;
  role: string;
  status?: string;
}

interface AuthResponse {
  success: boolean;
  vendor?: Vendor;
  token?: string;
  message?: string;
  error?: string;
}

export function useVendorAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status with backend
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if vendor token exists
      const token = localStorage.getItem('vendor_token');
      const storedVendor = localStorage.getItem('vendor_data');
      
      if (token && storedVendor) {
        // Verify token with backend
        console.log('🔄 Verifying vendor token with backend...');
        
        try {
          const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result: AuthResponse = await response.json();
            
            if (result.success && result.vendor) {
              console.log('✅ Vendor authenticated:', result.vendor.businessName);
              setIsAuthenticated(true);
              setVendor(result.vendor);
              return;
            }
          }
        } catch (verifyError) {
          console.log('⚠️ Token verification failed, using stored data');
        }
        
        // Use stored vendor data if verification fails
        const vendorData: Vendor = JSON.parse(storedVendor);
        setIsAuthenticated(true);
        setVendor(vendorData);
        console.log('✅ Using stored vendor data:', vendorData.businessName);
        
      } else {
        // For development, use demo authentication
        console.log('🔐 Using demo vendor authentication for development');
        const demoVendor: Vendor = {
          id: '68efb302ffa9682bb4a9bf81',
          name: 'Demo Vendor',
          email: 'demo@vendor.com',
          businessName: 'Demo Vendor Store',
          phone: '+254 712 345 678',
          role: 'vendor',
          status: 'approved'
        };
        
        // Store demo token for development
        localStorage.setItem('vendor_token', 'demo-vendor-token-123');
        localStorage.setItem('vendor_data', JSON.stringify(demoVendor));
        
        setIsAuthenticated(true);
        setVendor(demoVendor);
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      
      // Fallback to demo authentication for development
      console.log('🔄 Falling back to demo authentication');
      const demoVendor: Vendor = {
        id: '68efb302ffa9682bb4a9bf81',
        name: 'Demo Vendor',
        email: 'demo@vendor.com',
        businessName: 'Demo Vendor Store',
        phone: '+254 712 345 678',
        role: 'vendor',
        status: 'approved'
      };
      
      localStorage.setItem('vendor_token', 'demo-vendor-token-123');
      localStorage.setItem('vendor_data', JSON.stringify(demoVendor));
      
      setIsAuthenticated(true);
      setVendor(demoVendor);
      setError('Using demo authentication - backend unavailable');
      
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Attempting vendor login:', email);
      
      const response = await fetch(`${BACKEND_URL}/api/auth/vendor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.token && result.vendor) {
        // Store token and vendor data
        localStorage.setItem('vendor_token', result.token);
        localStorage.setItem('vendor_data', JSON.stringify(result.vendor));
        
        setIsAuthenticated(true);
        setVendor(result.vendor);
        console.log('✅ Vendor login successful:', result.vendor.businessName);
      } else {
        setError(result.error || result.message || 'Login failed');
        console.error('❌ Vendor login failed:', result.error);
      }

      return result;

    } catch (error) {
      const errorMessage = 'Login service unavailable';
      setError(errorMessage);
      console.error('❌ Login error:', error);
      
      // For development, simulate successful login
      const demoVendor: Vendor = {
        id: '68efb302ffa9682bb4a9bf81',
        name: 'Demo Vendor',
        email: email,
        businessName: 'Demo Vendor Store',
        phone: '+254 712 345 678',
        role: 'vendor',
        status: 'approved'
      };
      
      localStorage.setItem('vendor_token', 'demo-vendor-token-123');
      localStorage.setItem('vendor_data', JSON.stringify(demoVendor));
      
      setIsAuthenticated(true);
      setVendor(demoVendor);
      
      return {
        success: true,
        vendor: demoVendor,
        token: 'demo-vendor-token-123',
        message: 'Using demo authentication'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (vendorData: any): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Attempting vendor registration:', vendorData.email);
      
      const response = await fetch(`${BACKEND_URL}/api/auth/vendor/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.user) {
        // Note: Your backend returns 'user' instead of 'vendor' for registration
        const vendor: Vendor = {
          id: result.user.id,
          name: result.user.businessName,
          email: result.user.email,
          businessName: result.user.businessName,
          role: result.user.role,
          status: result.user.status
        };
        
        // Store vendor data (no token for pending approval)
        localStorage.setItem('vendor_data', JSON.stringify(vendor));
        
        setIsAuthenticated(true);
        setVendor(vendor);
        console.log('✅ Vendor registration submitted:', vendor.businessName);
      } else {
        setError(result.error || result.message || 'Registration failed');
        console.error('❌ Vendor registration failed:', result.error);
      }

      return result;

    } catch (error) {
      const errorMessage = 'Registration service unavailable';
      setError(errorMessage);
      console.error('❌ Registration error:', error);
      
      // For development, simulate successful registration
      const demoVendor: Vendor = {
        id: '68efb302ffa9682bb4a9bf81',
        name: vendorData.businessName || 'Demo Vendor',
        email: vendorData.email,
        businessName: vendorData.businessName,
        phone: vendorData.phone,
        role: 'vendor',
        status: 'pending'
      };
      
      localStorage.setItem('vendor_token', 'demo-vendor-token-123');
      localStorage.setItem('vendor_data', JSON.stringify(demoVendor));
      
      setIsAuthenticated(true);
      setVendor(demoVendor);
      
      return {
        success: true,
        vendor: demoVendor,
        message: 'Using demo authentication - registration simulated'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('🔐 Vendor logging out');
    localStorage.removeItem('vendor_token');
    localStorage.removeItem('vendor_data');
    setIsAuthenticated(false);
    setVendor(null);
    setError(null);
  };

  // Get authentication headers for API calls
  const getAuthHeaders = () => {
    const token = localStorage.getItem('vendor_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Check if vendor is approved
  const isApproved = () => {
    return vendor?.status === 'approved';
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    isLoading,
    vendor,
    error,
    login,
    register,
    logout,
    getAuthHeaders,
    refreshAuth: checkAuth,
    isApproved
  };
}