const categoryModel = require('../models/categoryModels');

// ✅ GET ALL CATEGORIES
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ GET CATEGORY BY ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Get category error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ CREATE CATEGORY (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. Admins only.' 
      });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Category name is required' 
      });
    }

    // Check if category already exists
    const existingCategory = await categoryModel.getCategoryByName(name);
    if (existingCategory) {
      return res.status(409).json({ 
        error: 'Category already exists',
        category: existingCategory
      });
    }

    const newCategory = await categoryModel.createCategory(name.trim());

    return res.status(201).json({
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ DELETE CATEGORY (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. Admins only.' 
      });
    }

    const deletedCategory = await categoryModel.deleteCategory(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json({
      message: 'Category deleted successfully',
      category: deletedCategory,
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ GET CATEGORIES FOR SPECIFIC COMPLAINT
const getCategoriesForComplaint = async (req, res) => {
  try {
    const { complaint_id } = req.params;

    const categories = await categoryModel.getCategoriesForComplaint(complaint_id);

    return res.status(200).json({
      success: true,
      complaint_id: parseInt(complaint_id),
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error('Get complaint categories error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
  getCategoriesForComplaint,
};
