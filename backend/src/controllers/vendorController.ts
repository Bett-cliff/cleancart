// backend/src/controllers/vendorController.ts
import { Request, Response } from 'express';
import { Vendor, IVendor } from '../models/Vendor';
import { Types } from 'mongoose';

// Get all vendors
export const getVendors = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, location, specialty } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};

    // Search filter
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { specialties: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Specialty filter
    if (specialty) {
      query.specialties = { $in: [new RegExp(specialty, 'i')] };
    }

    const vendors = await Vendor.find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Vendor.countDocuments(query);

    res.json({
      success: true,
      data: vendors,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendors',
      error: error.message
    });
  }
};

// Get vendor by ID
export const getVendorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID format'
      });
    }

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error: any) {
    console.error('Get vendor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor',
      error: error.message
    });
  }
};

// Create new vendor
export const createVendor = async (req: Request, res: Response) => {
  try {
    const {
      businessName,
      businessEmail,
      phoneNumber,
      location,
      description,
      specialties,
      isVerified = false,
      website,
      socialMedia,
      paymentMethods,
      deliveryOptions,
      minimumOrder
    } = req.body;

    // Validate required fields
    if (!businessName || !businessEmail || !phoneNumber || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: businessName, businessEmail, phoneNumber, location'
      });
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ 
      $or: [
        { businessEmail },
        { businessName }
      ]
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor with this email or business name already exists'
      });
    }

    const vendor = new Vendor({
      businessName,
      businessEmail,
      phoneNumber,
      location,
      description,
      specialties: specialties || [],
      isVerified,
      website,
      socialMedia: socialMedia || {},
      paymentMethods: paymentMethods || ['mpesa'],
      deliveryOptions: deliveryOptions || ['delivery'],
      minimumOrder: minimumOrder || 0
    });

    const savedVendor = await vendor.save();

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: savedVendor
    });
  } catch (error: any) {
    console.error('Create vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create vendor',
      error: error.message
    });
  }
};

// Update vendor
export const updateVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID format'
      });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor updated successfully',
      data: vendor
    });
  } catch (error: any) {
    console.error('Update vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor',
      error: error.message
    });
  }
};

// Delete vendor
export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor ID format'
      });
    }

    const vendor = await Vendor.findByIdAndDelete(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vendor',
      error: error.message
    });
  }
};