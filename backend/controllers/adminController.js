import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import CustomOrder from '../models/CustomOrder.js';
import ContactMessage from '../models/ContactMessage.js';
import Review from '../models/Review.js';

// @desc    Get Admin Dashboard KPI statistics and chart trends
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: { $in: ['Pending', 'Confirmed', 'Processing'] } });
    const completedOrders = await Order.countDocuments({ status: 'Delivered' });
    const totalCustomRequests = await CustomOrder.countDocuments();
    const pendingCustomRequests = await CustomOrder.countDocuments({ status: 'New Request' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const unreadMessages = await ContactMessage.countDocuments({ isRead: false });

    // Calculate total revenue
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent custom requests
    const recentCustomRequests = await CustomOrder.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Category distribution
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalCustomRequests,
        pendingCustomRequests,
        totalCustomers,
        unreadMessages,
      },
      recentOrders,
      recentCustomRequests,
      categoryStats,
      orderStatusBreakdown,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('product', 'name images slug').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate product rating
    if (productId) {
      const remainingReviews = await Review.find({ product: productId });
      const product = await Product.findById(productId);
      if (product) {
        product.numReviews = remainingReviews.length;
        product.rating = remainingReviews.length > 0
          ? (remainingReviews.reduce((acc, r) => acc + r.rating, 0) / remainingReviews.length).toFixed(1)
          : 5.0;
        await product.save();
      }
    }

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
