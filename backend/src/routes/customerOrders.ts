import express from 'express';
import { 
  getCustomerOrders, 
  getVendorOrders, 
  getOrderById, 
  updateOrderStatus,
  cancelOrder 
} from '../controllers/orderController';

const router = express.Router();

// Customer order routes
router.get('/customer/:customerId', getCustomerOrders);
router.get('/:orderId', getOrderById);
router.put('/:orderId/cancel', cancelOrder);

// Vendor order routes  
router.get('/vendor/:vendorId', getVendorOrders);
router.put('/:orderId/status', updateOrderStatus);

export default router;