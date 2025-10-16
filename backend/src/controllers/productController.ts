import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Types } from 'mongoose';

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: products
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Get product categories
export const getProductCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      originalPrice,
      stock,
      sku,
      images,
      vendorId,
      specifications,
      weight,
      dimensions,
      metaTitle,
      metaDescription,
      status = 'draft',
      isEcoFriendly = false,
      isFeatured = false,
      variants = []
    } = req.body;

    console.log('📦 Creating product with data:', {
      name,
      category,
      price,
      stock,
      vendorId,
      status
    });

    // Validate required fields
    if (!name || !description || !category || !price || !stock || !vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, category, price, stock, vendorId'
      });
    }

    // Create product
    const product = new Product({
      name,
      description,
      category,
      brand,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      stock: parseInt(stock),
      sku: sku || `PROD-${Date.now()}`,
      images: images || [],
      vendorId: new Types.ObjectId(vendorId),
      specifications: specifications || [],
      weight: weight ? parseFloat(weight) : undefined,
      dimensions: dimensions || {},
      metaTitle,
      metaDescription,
      status,
      isEcoFriendly,
      isFeatured,
      variants: variants || []
    });

    const savedProduct = await product.save();
    console.log('✅ Product created successfully:', savedProduct._id);

    res.status(201).json({
      success: true,
      message: `Product ${status === 'draft' ? 'saved as draft' : 'created successfully'}`,
      data: savedProduct
    });
  } catch (error: any) {
    console.error('❌ Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};