import mongoose from 'mongoose';

const customOrderSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      lowercase: true,
      trim: true,
    },
    whatWouldYouLike: {
      type: String,
      required: [true, 'Please describe your request headline'],
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
    },
    customizationDetails: {
      type: String,
      required: [true, 'Please provide detailed specifications'],
    },
    preferredSize: {
      type: String,
      default: 'Standard / Artist Choice',
    },
    budget: {
      type: String,
      default: 'Flexible',
    },
    requiredDate: {
      type: String,
      required: [true, 'Please specify the date needed by'],
    },
    referenceImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New Request', 'Under Review', 'Quote Sent', 'In Production', 'Completed', 'Declined'],
      default: 'New Request',
    },
    adminQuoteAmount: {
      type: Number,
      default: 0,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const CustomOrder = mongoose.model('CustomOrder', customOrderSchema);
export default CustomOrder;
