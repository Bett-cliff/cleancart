// backend/src/routes/vendors.ts
import express from 'express';
import {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
} from '../controllers/vendorController';

const router = express.Router();

// GET /api/vendors - Get all vendors
router.get('/', getVendors);

// GET /api/vendors/:id - Get vendor by ID
router.get('/:id', getVendorById);

// POST /api/vendors - Create new vendor
router.post('/', createVendor);

// PUT /api/vendors/:id - Update vendor
router.put('/:id', updateVendor);

// DELETE /api/vendors/:id - Delete vendor
router.delete('/:id', deleteVendor);

export default router;