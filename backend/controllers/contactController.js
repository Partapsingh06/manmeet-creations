import ContactMessage from '../models/ContactMessage.js';

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide your name, email and message' });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
    });

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Your message has reached our workshop! We will reply within 24 hours ✨',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact message (Admin)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark message read/replied (Admin)
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateMessageStatus = async (req, res) => {
  try {
    const { isRead, replyStatus } = req.body;
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

    if (isRead !== undefined) msg.isRead = isRead;
    if (replyStatus) msg.replyStatus = replyStatus;

    await msg.save();
    res.json({ success: true, message: 'Message status updated', msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
