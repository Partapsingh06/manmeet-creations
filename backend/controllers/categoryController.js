import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all categories with dynamic count
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });

    // Update item counts dynamically from actual products
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: { $regex: new RegExp(`^${cat.name}$`, 'i') },
        });
        return {
          ...cat.toObject(),
          itemCount: count,
        };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single category by ID or slug
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    let category;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id);
    } else {
      category = await Category.findOne({ slug: id.toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const itemCount = await Product.countDocuments({
      category: { $regex: new RegExp(`^${category.name}$`, 'i') },
    });

    res.json({
      success: true,
      category: {
        ...category.toObject(),
        itemCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, image, iconName, isFeatured } = req.body;

    if (!name || !image) {
      return res.status(400).json({ success: false, message: 'Category name and image are required' });
    }

    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    const categoryExists = await Category.findOne({
      $or: [{ slug }, { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } }],
    });

    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'A category with this name already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description || '',
      image,
      iconName: iconName || 'Sparkles',
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
    });

    res.status(201).json({
      success: true,
      category: { ...category.toObject(), itemCount: 0 },
      message: 'Category created successfully! ✨',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const oldName = category.name;
    const { name, description, image, iconName, isFeatured } = req.body;

    if (name && name.trim() !== oldName) {
      const newName = name.trim();
      const newSlug = newName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      
      // Check collision
      const exists = await Category.findOne({
        _id: { $ne: category._id },
        $or: [{ slug: newSlug }, { name: { $regex: new RegExp(`^${newName}$`, 'i') } }],
      });
      if (exists) {
        return res.status(400).json({ success: false, message: 'Another category with this name already exists' });
      }

      category.name = newName;
      category.slug = newSlug;

      // Update associated products so they keep matching this category
      await Product.updateMany(
        { category: { $regex: new RegExp(`^${oldName}$`, 'i') } },
        { $set: { category: newName } }
      );
    }

    if (description !== undefined) category.description = description;
    if (image) category.image = image;
    if (iconName) category.iconName = iconName;
    if (isFeatured !== undefined) category.isFeatured = Boolean(isFeatured);

    const updated = await category.save();
    const count = await Product.countDocuments({
      category: { $regex: new RegExp(`^${updated.name}$`, 'i') },
    });

    res.json({
      success: true,
      category: { ...updated.toObject(), itemCount: count },
      message: 'Category updated successfully! ✨',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const linkedProductsCount = await Product.countDocuments({
      category: { $regex: new RegExp(`^${category.name}$`, 'i') },
    });

    const isForce = req.query.force === 'true' || req.body.force === true;

    if (linkedProductsCount > 0 && !isForce) {
      return res.status(400).json({
        success: false,
        hasLinkedProducts: true,
        linkedProductsCount,
        categoryName: category.name,
        message: `This category has ${linkedProductsCount} product(s) attached. Deleting it requires confirmation to reassign products safely.`,
      });
    }

    // If force deleted, safely reassign linked products to 'Handmade Crafts' default
    if (linkedProductsCount > 0) {
      await Product.updateMany(
        { category: { $regex: new RegExp(`^${category.name}$`, 'i') } },
        { $set: { category: 'Handmade Crafts' } }
      );
    }

    // If category has a Cloudinary image, optionally remove it
    if (category.image && category.image.includes('cloudinary.com')) {
      await deleteFromCloudinary(category.image).catch(() => {});
    }

    await Category.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: `Category "${category.name}" deleted successfully. ${
        linkedProductsCount > 0 ? `${linkedProductsCount} product(s) safely reassigned.` : ''
      }`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
