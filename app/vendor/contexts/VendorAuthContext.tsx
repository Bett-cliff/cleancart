'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Vendor {
  _id: string;
  businessName: string;
  email: string;
}

interface VendorAuthContextType {
  vendor: Vendor | null;
  login: (vendorData: Vendor) => void;
  logout: () => void;
  isLoading: boolean;
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if vendor is logged in
    const savedVendor = localStorage.getItem('vendor_data');
    if (savedVendor) {
      setVendor(JSON.parse(savedVendor));
    }
    setIsLoading(false);
  }, []);

  const login = (vendorData: Vendor) => {
    setVendor(vendorData);
    localStorage.setItem('vendor_data', JSON.stringify(vendorData));
  };

  const logout = () => {
    setVendor(null);
    localStorage.removeItem('vendor_data');
  };

  return (
    <VendorAuthContext.Provider value={{ vendor, login, logout, isLoading }}>
      {children}
    </VendorAuthContext.Provider>
  );
}

export function useVendorAuth() {
  const context = useContext(VendorAuthContext);
  if (context === undefined) {
    throw new Error('useVendorAuth must be used within a VendorAuthProvider');
  }
  return context;
}