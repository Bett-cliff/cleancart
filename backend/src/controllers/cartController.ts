import { Request, Response } from 'express';
import { carts } from '../models/Cart';
import { products } from '../models/Product';

// Helper function to calculate cart total
const calculateTotal = (items: any[]) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Get user's cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    let cart = carts.find(c => c.userId === userId);
    
    // If no cart exists, create an empty one
    if (!cart) {
      cart = {
        userId,
        items: [],
        total: 0
      };
      carts.push(cart);
    }

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching cart' 
    });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;

    // Find product
    const product = products.find(p => p._id === productId);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Find or create cart
    let cart = carts.find(c => c.userId === userId);
    if (!cart) {
      cart = {
        userId,
        items: [],
        total: 0
      };
      carts.push(cart);
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        productId,
        quantity,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }

    // Update total
    cart.total = calculateTotal(cart.items);

    res.json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error adding to cart' 
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const cart = carts.find(c => c.userId === userId);
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Item not found in cart' 
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Update total
    cart.total = calculateTotal(cart.items);

    res.json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error updating cart' 
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.params;

    const cart = carts.find(c => c.userId === userId);
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Item not found in cart' 
      });
    }

    // Remove item
    cart.items.splice(itemIndex, 1);
    
    // Update total
    cart.total = calculateTotal(cart.items);

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error removing from cart' 
    });
  }
};

// Clear entire cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const cart = carts.find(c => c.userId === userId);
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }

    // Clear all items
    cart.items = [];
    cart.total = 0;

    res.json({
      success: true,
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error clearing cart' 
    });
  }
};