const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
  getCategoriesForComplaint,
} = require('../controllers/categoryController');
const { jwtAuthMiddleware, adminOnly } = require('../middlewares/jwtAuthMiddleware');

const router = express.Router();

// ✅ GET /api/categories - Get all categories (No auth needed - public)
router.get('/', getAllCategories);

// ✅ GET /api/categories/:id - Get single category
router.get('/:id', getCategoryById);

// ✅ GET /api/categories/complaint/:complaint_id - Get categories for complaint
router.get('/complaint/:complaint_id', getCategoriesForComplaint);

// ✅ POST /api/categories - Create category (Admin only)
router.post('/', jwtAuthMiddleware, adminOnly, createCategory);

// ✅ DELETE /api/categories/:id - Delete category (Admin only)
router.delete('/:id', jwtAuthMiddleware, adminOnly, deleteCategory);

module.exports = router;
