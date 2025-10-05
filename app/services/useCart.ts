'use client';

import { useState, useEffect } from 'react';
import { Cart, CartItem, apiService } from './api';

export const useCart = (userId: string) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getCart(userId);
        setCart(data.cart);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const addToCart = async (productData: { productId: string; quantity?: number }) => {
    try {
      const data = await apiService.addToCart(userId, productData);
      setCart(data.cart);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      const data = await apiService.updateCartItem(userId, productId, quantity);
      setCart(data.cart);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const data = await apiService.removeFromCart(userId, productId);
      setCart(data.cart);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const data = await apiService.clearCart(userId);
      setCart(data.cart);
      return data;
    } catch (err) {
      throw err;
    }
  };

  return {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };
};