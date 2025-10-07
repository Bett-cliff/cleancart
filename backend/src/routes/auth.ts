import express from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Vendor Registration
router.post('/vendor/register', async (req, res) => {
  try {
    const { businessName, email, password, phone, address, businessDescription, businessType } = req.body;

    console.log('📝 Vendor registration attempt:', { businessName, email });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new vendor user
    const vendor = new User({
      name: businessName, // Using businessName as the name field
      email,
      password: hashedPassword,
      role: 'vendor',
      businessName,
      phone,
      address,
      businessDescription,
      businessType,
      status: 'pending'
    });

    await vendor.save();

    console.log('✅ Vendor registered successfully:', vendor._id);

    res.status(201).json({
      success: true,
      message: 'Vendor registration submitted for approval',
      user: {
        id: vendor._id,
        businessName: vendor.businessName,
        email: vendor.email,
        role: vendor.role,
        status: vendor.status
      }
    });
  } catch (error) {
    console.error('❌ Vendor registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Vendor Login
router.post('/vendor/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Vendor login attempt:', email);

    // Find vendor user
    const vendor = await User.findOne({ email, role: 'vendor' });
    if (!vendor) {
      return res.status(401).json({
        success: false,
        error: 'Vendor account not found'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if approved
    if (vendor.status !== 'approved') {
      return res.status(401).json({
        success: false,
        error: 'Your vendor account is pending approval'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: vendor._id, role: vendor.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ Vendor login successful:', vendor._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      vendor: {
        id: vendor._id,
        businessName: vendor.businessName,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        role: vendor.role
      }
    });
  } catch (error) {
    console.error('❌ Vendor login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Get all vendors (for admin)
router.get('/vendors', async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password');
    
    res.json({
      success: true,
      vendors
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vendors'
    });
  }
});

// Update vendor status (admin)
router.patch('/vendors/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const vendor = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'vendor' },
      { status, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: `Vendor ${status} successfully`,
      vendor
    });
  } catch (error) {
    console.error('Update vendor status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update vendor status'
    });
  }
});

export default router;