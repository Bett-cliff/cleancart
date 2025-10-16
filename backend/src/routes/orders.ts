// backend/src/routes/orders.ts
import express from 'express';
import {
  createOrder,
  getCustomerOrders,
  getVendorOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder
} from '../controllers/orderController';

const router = express.Router();

// Create a new order
router.post('/', createOrder);

// Get all orders (admin)
router.get('/', getAllOrders);

// Get orders for a specific customer
router.get('/customer/:customerId', getCustomerOrders);

// Get orders for a specific vendor
router.get('/vendor/:vendorId', getVendorOrders);

// Get single order by ID
router.get('/:orderId', getOrderById);

// Update order status
router.put('/:orderId/status', updateOrderStatus);

// Cancel order
router.put('/:orderId/cancel', cancelOrder);

export default router;