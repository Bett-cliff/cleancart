import express from 'express';
import { 
  getProducts, 
  getProductById, 
  getProductCategories,
  createProduct,
  getVendorProducts,
  updateProduct,  // Add this import
  deleteProduct   // Add this import
} from '../controllers/productController';

const router = express.Router();

// GET Routes
router.get('/', getProducts);
router.get('/categories', getProductCategories);
router.get('/:id', getProductById);
router.get('/vendor/:vendorId', getVendorProducts);

// POST Route
router.post('/', createProduct);

// PUT Route - Update product
router.put('/:id', updateProduct);

// DELETE Route - Delete product
router.delete('/:id', deleteProduct);

export default router;