import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';
import { sanitizeImageUrl, sanitizeImageList } from '../utils/imageSanitizer.js';

// Helper to make clean URL slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Helper to sanitize product document image fields for response
const formatProductForResponse = (prod) => {
  if (!prod) return null;
  const obj = prod.toObject ? prod.toObject() : { ...prod };
  const rawImages = Array.isArray(obj.images) ? obj.images : obj.images ? [obj.images] : [];
  const cleanImages = sanitizeImageList(rawImages);
  
  obj.images = cleanImages.length > 0 ? cleanImages : [sanitizeImageUrl('')];
  obj.featuredImage = sanitizeImageUrl(obj.featuredImage || obj.images[0]);
  return obj;
};

// @desc    Fetch all products with filtering, search & sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, rating, sort, inStock, featured } = req.query;

    const query = {};

    if (category && category !== 'All' && category !== '') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (inStock === 'true') {
      query.inStock = true;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'popular' || sort === 'rating') sortOption = { rating: -1, numReviews: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const rawProducts = await Product.find(query).sort(sortOption);
    const totalCount = await Product.countDocuments(query);
    const products = rawProducts.map(formatProductForResponse);

    res.json({
      success: true,
      count: products.length,
      totalCount,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured products for homepage
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    let products = await Product.find({ isFeatured: true }).limit(8);
    // If fewer than 8 marked featured, grab up to 8 top rated
    if (products.length < 8) {
      products = await Product.find().sort({ rating: -1 }).limit(8);
    }
    const formatted = products.map(formatProductForResponse);
    res.json({ success: true, products: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let product = null;

    if (idOrSlug && typeof idOrSlug === 'string') {
      if (mongoose.isValidObjectId(idOrSlug)) {
        product = await Product.findById(idOrSlug);
      }
      if (!product) {
        product = await Product.findOne({ slug: idOrSlug.toLowerCase() });
      }
      if (!product) {
        // Fallback exact ID match in case of string representation
        try {
          product = await Product.findOne({ _id: idOrSlug });
        } catch {
          // ignore
        }
      }
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get related products from the same category
    const relatedProductsRaw = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    // Get reviews
    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      product: formatProductForResponse(product),
      relatedProducts: relatedProductsRaw.map(formatProductForResponse),
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      originalPrice,
      images,
      featuredImage,
      materials,
      dimensions,
      leadTimeDays,
      isCustomizable,
      customizationNote,
      inStock,
      countInStock,
      isFeatured,
      isBestSeller,
      tags,
    } = req.body;

    let processedImages = sanitizeImageList(images);

    if (featuredImage) {
      const cleanFeatured = sanitizeImageUrl(featuredImage, '');
      if (cleanFeatured && !processedImages.includes(cleanFeatured)) {
        processedImages.unshift(cleanFeatured);
      }
    }

    if (!name || !price || !category || processedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product name, selling price, category, and at least one valid image.',
      });
    }

    const baseSlug = slugify(name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const discountPercent =
      originalPrice && Number(originalPrice) > Number(price)
        ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
        : 0;

    const product = new Product({
      name: name.trim(),
      slug: uniqueSlug,
      description: description || 'Handcrafted bespoke artisan piece.',
      category: category.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      discountPercent,
      images: processedImages,
      featuredImage: sanitizeImageUrl(featuredImage || processedImages[0]),
      materials: Array.isArray(materials)
        ? materials
        : materials
        ? materials.split(',').map((m) => m.trim()).filter(Boolean)
        : [],
      dimensions: dimensions || 'Customizable',
      leadTimeDays: leadTimeDays ? Number(leadTimeDays) : 3,
      isCustomizable: isCustomizable !== undefined ? Boolean(isCustomizable) : true,
      customizationNote: customizationNote || 'Customized to your personal aesthetic request.',
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      countInStock: countInStock !== undefined ? Number(countInStock) : 10,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
      isBestSeller: isBestSeller !== undefined ? Boolean(isBestSeller) : false,
      tags: Array.isArray(tags)
        ? tags
        : tags
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    });

    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      product: formatProductForResponse(createdProduct),
      message: 'Product created successfully! ✨',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.isValidObjectId(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const fields = req.body;

    if (fields.name && fields.name !== product.name) {
      product.name = fields.name.trim();
      product.slug = slugify(fields.name);
    }

    if (fields.price !== undefined) product.price = Number(fields.price);
    if (fields.originalPrice !== undefined) product.originalPrice = Number(fields.originalPrice);

    if (product.originalPrice && product.price && product.originalPrice > product.price) {
      product.discountPercent = Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    } else {
      product.discountPercent = 0;
    }

    if (fields.description !== undefined) product.description = fields.description;
    if (fields.category !== undefined) product.category = fields.category.trim();

    if (fields.images !== undefined) {
      const nextImages = sanitizeImageList(fields.images);
      product.images = nextImages;
      product.featuredImage = sanitizeImageUrl(fields.featuredImage || nextImages[0] || '');
    } else if (fields.featuredImage !== undefined) {
      product.featuredImage = sanitizeImageUrl(fields.featuredImage);
    }

    if (fields.materials !== undefined) {
      product.materials = Array.isArray(fields.materials)
        ? fields.materials
        : fields.materials.split(',').map((m) => m.trim()).filter(Boolean);
    }
    if (fields.dimensions !== undefined) product.dimensions = fields.dimensions;
    if (fields.leadTimeDays !== undefined) product.leadTimeDays = Number(fields.leadTimeDays);
    if (fields.isCustomizable !== undefined) product.isCustomizable = Boolean(fields.isCustomizable);
    if (fields.customizationNote !== undefined) product.customizationNote = fields.customizationNote;
    if (fields.inStock !== undefined) product.inStock = Boolean(fields.inStock);
    if (fields.countInStock !== undefined) product.countInStock = Number(fields.countInStock);
    if (fields.isFeatured !== undefined) product.isFeatured = Boolean(fields.isFeatured);
    if (fields.isBestSeller !== undefined) product.isBestSeller = Boolean(fields.isBestSeller);
    if (fields.tags !== undefined) {
      product.tags = Array.isArray(fields.tags)
        ? fields.tags
        : fields.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const updatedProduct = await product.save();
    res.json({
      success: true,
      product: formatProductForResponse(updatedProduct),
      message: 'Product updated successfully! ✨',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.isValidObjectId(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Clean up images in Cloudinary if configured
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        if (imgUrl && typeof imgUrl === 'string' && imgUrl.includes('cloudinary.com')) {
          await deleteFromCloudinary(imgUrl).catch(() => {});
        }
      }
    }

    await Product.deleteOne({ _id: product._id });
    await Review.deleteMany({ product: product._id });

    res.json({ success: true, message: `Product "${product.name}" removed from collection` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Public / Authenticated
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, name, city } = req.body;
    const { id } = req.params;
    let product = null;

    if (mongoose.isValidObjectId(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviewName = req.user ? req.user.name : name || 'Anonymous Art Enthusiast';
    const reviewCity = city || 'India';

    const review = new Review({
      product: product._id,
      user: req.user ? req.user._id : undefined,
      name: reviewName,
      rating: Number(rating) || 5,
      comment,
      city: reviewCity,
      isVerifiedPurchase: true,
    });

    await review.save();

    // Recalculate rating
    const allReviews = await Review.find({ product: product._id });
    product.numReviews = allReviews.length;
    product.rating = Number(
      (allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length).toFixed(1)
    );

    await product.save();

    res.status(201).json({
      success: true,
      review,
      message: 'Thank you for your lovely review! ✨',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
