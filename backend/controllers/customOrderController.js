import CustomOrder from '../models/CustomOrder.js';

const generateCustomRequestId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `REQ-${randomNum}`;
};

// @desc    Submit bespoke custom order request
// @route   POST /api/custom-orders
// @access  Public
export const createCustomOrder = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      whatWouldYouLike,
      category,
      customizationDetails,
      preferredSize,
      budget,
      requiredDate,
      referenceImage,
    } = req.body;

    if (!fullName || !phone || !email || !whatWouldYouLike || !category || !customizationDetails || !requiredDate) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (Name, Phone, Email, Request, Category, Details, Required Date)',
      });
    }

    const requestId = generateCustomRequestId();

    const customOrder = new CustomOrder({
      requestId,
      user: req.user ? req.user._id : undefined,
      fullName,
      phone,
      email,
      whatWouldYouLike,
      category,
      customizationDetails,
      preferredSize: preferredSize || 'Standard / Artist Discretion',
      budget: budget || 'Flexible',
      requiredDate,
      referenceImage: referenceImage || '',
      status: 'New Request',
    });

    const savedRequest = await customOrder.save();

    res.status(201).json({
      success: true,
      customOrder: savedRequest,
      message: `Your bespoke request ${requestId} has been received! Our lead artisan Manmeet will reach out shortly. ✨`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all custom orders (Admin)
// @route   GET /api/custom-orders
// @access  Private/Admin
export const getAllCustomOrders = async (req, res) => {
  try {
    const requests = await CustomOrder.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: requests.length,
      customOrders: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get custom order by ID
// @route   GET /api/custom-orders/:id
// @access  Public
export const getCustomOrderById = async (req, res) => {
  try {
    const request = await CustomOrder.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Custom order request not found' });
    }
    res.json({
      success: true,
      customOrder: request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update custom order status / quote (Admin)
// @route   PUT /api/custom-orders/:id
// @access  Private/Admin
export const updateCustomOrderStatus = async (req, res) => {
  try {
    const { status, adminQuoteAmount, adminNotes } = req.body;
    const request = await CustomOrder.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Custom order request not found' });
    }

    if (status) request.status = status;
    if (adminQuoteAmount !== undefined) request.adminQuoteAmount = Number(adminQuoteAmount);
    if (adminNotes !== undefined) request.adminNotes = adminNotes;

    const updated = await request.save();

    res.json({
      success: true,
      customOrder: updated,
      message: 'Custom order status updated successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
