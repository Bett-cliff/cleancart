import express from 'express';
import { 
  getProducts, 
  getProductById, 
  getProductCategories,
  createProduct 
} from '../controllers/productController';

const router = express.Router();

// GET Routes
router.get('/', getProducts);
router.get('/categories', getProductCategories);
router.get('/:id', getProductById);

// POST Route
router.post('/', createProduct);

export default router;