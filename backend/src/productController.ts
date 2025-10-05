import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    
    // Build filter object
    const filter: any = {};
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get products from MongoDB
    const products = await Product.find(filter);

    res.json({
      success: true,
      products,
      total: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching products' 
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get product from MongoDB
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching product' 
    });
  }
};

export const getProductCategories = async (req: Request, res: Response) => {
  try {
    // Get unique categories from MongoDB
    const categories = await Product.distinct('category');
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching categories' 
    });
  }
};