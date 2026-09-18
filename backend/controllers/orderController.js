import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Generate human readable unique order ID like MC-2026-8742
const generateOrderId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const dateStr = new Date().getFullYear();
  return `MC-${dateStr}-${randomNum}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public / Authenticated
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      customerInfo,
      itemsPrice,
      shippingPrice,
      discountPrice,
      totalAmount,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ success: false, message: 'Please provide full shipping address details' });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      return res.status(400).json({ success: false, message: 'Please provide customer name, phone, and email' });
    }

    const orderId = generateOrderId();

    const order = new Order({
      orderId,
      user: req.user ? req.user._id : undefined,
      customerInfo,
      shippingAddress,
      orderItems,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      itemsPrice: Number(itemsPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      discountPrice: Number(discountPrice) || 0,
      totalAmount: Number(totalAmount) || 0,
      status: 'Confirmed',
      isPaid: paymentMethod === 'UPI / Online Payment' ? true : false,
      paidAt: paymentMethod === 'UPI / Online Payment' ? new Date() : undefined,
    });

    const createdOrder = await order.save();

    // Decrement stock for purchased products
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock = Math.max(0, product.countInStock - item.quantity);
        if (product.countInStock === 0) {
          product.inStock = false;
        }
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      order: createdOrder,
      message: 'Order Placed Successfully 🎉 Thank you for choosing Manmeet Creations!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user._id },
        { 'customerInfo.email': req.user.email }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID or orderId
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('user', 'name email phone');
    } else {
      order = await Order.findOne({ orderId: id }).populate('user', 'name email phone');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, adminNotes, isPaid } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) {
      order.status = status;
      if (status === 'Delivered') {
        order.deliveredAt = new Date();
        order.isPaid = true;
      }
    }

    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;
    if (isPaid !== undefined) {
      order.isPaid = Boolean(isPaid);
      if (order.isPaid && !order.paidAt) {
        order.paidAt = new Date();
      }
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
      message: `Order status successfully updated to "${order.status}"!`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
