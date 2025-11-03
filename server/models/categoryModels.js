const { pool } = require('../config/pool');

// Get all categories
const getAllCategories = async () => {
  try {
    const query = 'SELECT * FROM categories ORDER BY name ASC;';
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error fetching categories:', err);
    throw err;
  }
};

// Get category by ID
const getCategoryById = async (category_id) => {
  try {
    const query = 'SELECT * FROM categories WHERE category_id = $1;';
    const result = await pool.query(query, [category_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error fetching category:', err);
    throw err;
  }
};

// Get category by name (case insensitive)
const getCategoryByName = async (name) => {
  try {
    const query = 'SELECT * FROM categories WHERE LOWER(name) = LOWER($1);';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  } catch (err) {
    console.error('Error fetching category by name:', err);
    throw err;
  }
};

// Create category
const createCategory = async (name) => {
  try {
    const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *;';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  } catch (err) {
    console.error('Error creating category:', err);
    throw err;
  }
};

// Delete category
const deleteCategory = async (category_id) => {
  try {
    const query = 'DELETE FROM categories WHERE category_id = $1 RETURNING *;';
    const result = await pool.query(query, [category_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error deleting category:', err);
    throw err;
  }
};

// Link complaint to category
const linkComplaintToCategory = async (complaint_id, category_id) => {
  try {
    const query = `
      INSERT INTO complaint_categories (complaint_id, category_id) 
      VALUES ($1, $2) 
      ON CONFLICT (complaint_id, category_id) DO NOTHING
      RETURNING *;
    `;
    const result = await pool.query(query, [complaint_id, category_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error linking complaint to category:', err);
    throw err;
  }
};

// Get categories for a complaint
const getCategoriesForComplaint = async (complaint_id) => {
  try {
    const query = `
      SELECT c.* 
      FROM categories c
      INNER JOIN complaint_categories cc ON c.category_id = cc.category_id
      WHERE cc.complaint_id = $1;
    `;
    const result = await pool.query(query, [complaint_id]);
    return result.rows;
  } catch (err) {
    console.error('Error getting categories for complaint:', err);
    throw err;
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  createCategory,
  deleteCategory,
  linkComplaintToCategory,
  getCategoriesForComplaint,
};
