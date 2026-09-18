import Category from '../models/Category.js';
import Product from '../models/Product.js';

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

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, image, iconName } = req.body;
    
    if (!name || !image) {
      return res.status(400).json({ success: false, message: 'Name and image are required' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const categoryExists = await Category.findOne({ slug });

    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image,
      iconName: iconName || 'Sparkles',
    });

    res.status(201).json({ success: true, category, message: 'Category created!' });
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

    if (req.body.name) {
      category.name = req.body.name;
      category.slug = req.body.name.toLowerCase().replace(/\s+/g, '-');
    }
    if (req.body.description !== undefined) category.description = req.body.description;
    if (req.body.image) category.image = req.body.image;
    if (req.body.iconName) category.iconName = req.body.iconName;

    const updated = await category.save();
    res.json({ success: true, category: updated, message: 'Category updated!' });
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

    await Category.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Category deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
