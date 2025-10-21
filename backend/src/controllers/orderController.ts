// backend/src/controllers/orderController.ts
import { Request, Response } from 'express';
import { Order, IOrder } from '../models/Order';
import { Types } from 'mongoose';

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee = 0,
      taxAmount = 0,
      notes
    } = req.body;

    // Validate required fields
    if (!customerId || !items || !shippingAddress || !paymentMethod || !subtotal) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerId, items, shippingAddress, paymentMethod, subtotal'
      });
    }

    // Calculate total amount
    const totalAmount = subtotal + shippingFee + taxAmount;

    // Group items by vendor for vendorOrders
    const vendorOrdersMap = new Map();
    
    items.forEach((item: any) => {
      const vendorId = item.vendorId.toString();
      if (!vendorOrdersMap.has(vendorId)) {
        vendorOrdersMap.set(vendorId, {
          vendorId: new Types.ObjectId(vendorId),
          items: []
        });
      }
      vendorOrdersMap.get(vendorId).items.push(item);
    });

    const vendorOrders = Array.from(vendorOrdersMap.values());

    // Create order
    const order = new Order({
      customerId: new Types.ObjectId(customerId),
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      taxAmount,
      totalAmount,
      vendorOrders,
      notes
    });

    const savedOrder = await order.save();
    
    // Populate the saved order with customer and product details
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('customerId', 'name email')
      .populate('items.productId', 'name price images')
      .populate('vendorOrders.vendorId', 'businessName email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Create marketplace order (from cart checkout)
export const createMarketplaceOrder = async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      cartItems,
      shippingAddress,
      paymentMethod,
      notes
    } = req.body;

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate required fields
    if (!customerId || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerId, shippingAddress, paymentMethod'
      });
    }

    // Calculate totals from cart items
    const subtotal = cartItems.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0);
    const shippingFee = 0; // Could be calculated based on location
    const taxAmount = subtotal * 0.16; // 16% VAT in Kenya
    const totalAmount = subtotal + shippingFee + taxAmount;

    // Group items by vendor for vendorOrders
    const vendorOrdersMap = new Map();

    cartItems.forEach((item: any) => {
      const vendorId = item.vendorId;
      if (!vendorOrdersMap.has(vendorId)) {
        vendorOrdersMap.set(vendorId, {
          vendorId: new Types.ObjectId(vendorId),
          items: [],
          status: 'pending'
        });
      }
      vendorOrdersMap.get(vendorId).items.push({
        productId: new Types.ObjectId(item.productId || item.id),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '/api/placeholder/200/200',
        vendorId: new Types.ObjectId(item.vendorId)
      });
    });

    const vendorOrders = Array.from(vendorOrdersMap.values());

    // Transform cart items to order items format
    const orderItems = cartItems.map((item: any) => ({
      productId: new Types.ObjectId(item.productId || item.id),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || '/api/placeholder/200/200',
      vendorId: new Types.ObjectId(item.vendorId)
    }));

    // Create order
    const order = new Order({
      customerId: new Types.ObjectId(customerId),
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      taxAmount,
      totalAmount,
      vendorOrders,
      notes: notes || 'Order from CleanCart Marketplace'
    });

    const savedOrder = await order.save();

    // Populate the saved order with customer and product details
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('customerId', 'name email phone')
      .populate('items.productId', 'name price images category')
      .populate('vendorOrders.vendorId', 'businessName email phone location');

    res.status(201).json({
      success: true,
      message: 'Marketplace order created successfully',
      data: populatedOrder
    });

  } catch (error: any) {
    console.error('Create marketplace order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create marketplace order',
      error: error.message
    });
  }
};

// Get orders for a customer
export const getCustomerOrders = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID is required'
      });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find({ customerId: new Types.ObjectId(customerId) })
      .populate('items.productId', 'name price images')
      .populate('vendorOrders.vendorId', 'businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments({ customerId: new Types.ObjectId(customerId) });

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get customer orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get orders for a vendor
export const getVendorOrders = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID is required'
      });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Find orders that have items from this vendor
    let query: any = { 'vendorOrders.vendorId': new Types.ObjectId(vendorId) };
    
    if (status) {
      query['vendorOrders.status'] = status;
    }

    const orders = await Order.find(query)
      .populate('customerId', 'name email phone')
      .populate('items.productId', 'name price images')
      .populate('vendorOrders.vendorId', 'businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get vendor orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor orders',
      error: error.message
    });
  }
};

// Get single order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('customerId', 'name email phone')
      .populate('items.productId', 'name price images description')
      .populate('vendorOrders.vendorId', 'businessName email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Update order status (admin/vendor)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus, vendorStatus } = req.body;

    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    // If vendor status update for specific vendor
    if (vendorStatus && vendorStatus.vendorId) {
      updateData.$set = {
        'vendorOrders.$[elem].status': vendorStatus.status,
        'vendorOrders.$[elem].shippingTracking': vendorStatus.shippingTracking
      };
    }

    const options: any = { new: true };
    if (vendorStatus) {
      options.arrayFilters = [{ 'elem.vendorId': new Types.ObjectId(vendorStatus.vendorId) }];
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      options
    ).populate('customerId', 'name email')
     .populate('items.productId', 'name price')
     .populate('vendorOrders.vendorId', 'businessName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error: any) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Update vendor order status specifically
export const updateVendorOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, vendorId } = req.params;
    const { status, shippingTracking } = req.body;

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        'vendorOrders.vendorId': vendorId
      },
      {
        $set: {
          'vendorOrders.$.status': status,
          'vendorOrders.$.shippingTracking': shippingTracking,
          'updatedAt': new Date()
        }
      },
      { new: true }
    ).populate('customerId', 'name email phone')
     .populate('items.productId', 'name price images')
     .populate('vendorOrders.vendorId', 'businessName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order or vendor order not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor order status updated successfully',
      data: order
    });
  } catch (error: any) {
    console.error('Update vendor order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor order status',
      error: error.message
    });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('customerId', 'name email')
      .populate('items.productId', 'name price')
      .populate('vendorOrders.vendorId', 'businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        orderStatus: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Order cancelled by user'
      },
      { new: true }
    ).populate('customerId', 'name email')
     .populate('items.productId', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error: any) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};