import express from 'express';
import { getProducts, getProductById, getProductCategories } from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getProductCategories);
router.get('/:id', getProductById);

export default router;