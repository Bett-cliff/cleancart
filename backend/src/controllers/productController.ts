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

// Get products by vendor ID
export const getVendorProducts = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const { page = 1, limit = 50, status, category, search } = req.query;

    console.log('🔄 Fetching products for vendor:', vendorId);

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query: any = { vendorId: new Types.ObjectId(vendorId) };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    console.log(`✅ Found ${products.length} products for vendor ${vendorId}`);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('❌ Get vendor products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor products',
      error: error.message
    });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('🔄 Updating product:', id);
    console.log('📦 Update data:', updateData);

    // Validate product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    console.log('✅ Product updated successfully:', id);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error: any) {
    console.error('❌ Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting product:', id);

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(id);

    console.log('✅ Product deleted successfully:', id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};