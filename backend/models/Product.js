import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    materials: {
      type: [String],
      default: [],
    },
    dimensions: {
      type: String,
      default: '',
    },
    leadTimeDays: {
      type: Number,
      default: 3,
    },
    isCustomizable: {
      type: Boolean,
      default: true,
    },
    customizationNote: {
      type: String,
      default: 'Can be customized with names, colors, dates, or personal quotes upon request.',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    countInStock: {
      type: Number,
      default: 15,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
