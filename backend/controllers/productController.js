import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

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

    const products = await Product.find(query).sort(sortOption);
    const totalCount = await Product.countDocuments(query);

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
    const products = await Product.find({ isFeatured: true }).limit(8);
    // If fewer than 8 marked featured, grab up to 8 top rated
    if (products.length < 8) {
      const topProducts = await Product.find().sort({ rating: -1 }).limit(8);
      return res.json({ success: true, products: topProducts });
    }
    res.json({ success: true, products });
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
    let product;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug);
    } else {
      product = await Product.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get related products from the same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    // Get reviews
    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      product,
      relatedProducts,
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

    let processedImages = [];
    if (Array.isArray(images)) {
      processedImages = images.filter(Boolean);
    } else if (typeof images === 'string' && images.trim() !== '') {
      processedImages = images.split(',').map((img) => img.trim()).filter(Boolean);
    }

    if (featuredImage && !processedImages.includes(featuredImage)) {
      processedImages.unshift(featuredImage);
    }

    if (!name || !price || !category || processedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product name, selling price, category, and at least one image.',
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
      featuredImage: featuredImage || processedImages[0] || '',
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
      product: createdProduct,
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
    const product = await Product.findById(req.params.id);

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
      let nextImages = [];
      if (Array.isArray(fields.images)) {
        nextImages = fields.images.filter(Boolean);
      } else if (typeof fields.images === 'string' && fields.images.trim() !== '') {
        nextImages = fields.images.split(',').map((img) => img.trim()).filter(Boolean);
      }
      product.images = nextImages;
      product.featuredImage = fields.featuredImage || nextImages[0] || '';
    } else if (fields.featuredImage !== undefined) {
      product.featuredImage = fields.featuredImage;
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
      product: updatedProduct,
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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Clean up images in Cloudinary if configured
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        if (imgUrl.includes('cloudinary.com')) {
          await deleteFromCloudinary(imgUrl).catch(() => {});
        }
      }
    }

    await Product.deleteOne({ _id: req.params.id });
    await Review.deleteMany({ product: req.params.id });

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
    const product = await Product.findById(req.params.id);

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
