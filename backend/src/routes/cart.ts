import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../controllers/cartController';

const router = express.Router();

router.get('/:userId', getCart);
router.post('/:userId/items', addToCart);
router.put('/:userId/items/:productId', updateCartItem);
router.delete('/:userId/items/:productId', removeFromCart);
router.delete('/:userId/clear', clearCart);

export default router;