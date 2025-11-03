const { pool } = require('../config/pool');

// Create a new complaint
const createComplaint = async (
  user_id,
  title,
  description,
  image_url,
  latitude,
  longitude,
  address
) => {
  try {
    const query = `
      INSERT INTO complaints 
        (user_id, title, description, image_url, latitude, longitude, address, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') 
      RETURNING *;
    `;
    const result = await pool.query(query, [
      user_id,
      title,
      description,
      image_url || null,
      latitude || null,
      longitude || null,
      address || null,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error('Error creating complaint:', err);
    throw err;
  }
};

// Assign category to complaint
const assignCategory = async (complaint_id, category_id) => {
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
    console.error('Error assigning category:', err);
    throw err;
  }
};

// Get all complaints with categories
const getAllComplaints = async () => {
  try {
    const query = `
      SELECT c.*, u.name AS user_name, u.email AS user_email,
             COALESCE(
               json_agg(
                 json_build_object('category_id', cat.category_id, 'name', cat.name)
               ) FILTER (WHERE cat.category_id IS NOT NULL),
               '[]'
             ) AS categories
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN complaint_categories cc ON c.complaint_id = cc.complaint_id
      LEFT JOIN categories cat ON cc.category_id = cat.category_id
      GROUP BY c.complaint_id, u.user_id
      ORDER BY c.created_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error fetching complaints:', err);
    throw err;
  }
};

// Get complaint by ID with categories
const getComplaintById = async (complaint_id) => {
  try {
    const query = `
      SELECT c.*, u.name AS user_name, u.email AS user_email,
             COALESCE(
               json_agg(
                 json_build_object('category_id', cat.category_id, 'name', cat.name)
               ) FILTER (WHERE cat.category_id IS NOT NULL),
               '[]'
             ) AS categories
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN complaint_categories cc ON c.complaint_id = cc.complaint_id
      LEFT JOIN categories cat ON cc.category_id = cat.category_id
      WHERE c.complaint_id = $1
      GROUP BY c.complaint_id, u.user_id;
    `;
    const result = await pool.query(query, [complaint_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error fetching complaint:', err);
    throw err;
  }
};

// Get complaints by user ID with categories
const getComplaintsByUserId = async (user_id) => {
  try {
    const query = `
      SELECT c.*,
             COALESCE(
               json_agg(
                 json_build_object('category_id', cat.category_id, 'name', cat.name)
               ) FILTER (WHERE cat.category_id IS NOT NULL),
               '[]'
             ) AS categories
      FROM complaints c
      LEFT JOIN complaint_categories cc ON c.complaint_id = cc.complaint_id
      LEFT JOIN categories cat ON cc.category_id = cat.category_id
      WHERE c.user_id = $1
      GROUP BY c.complaint_id
      ORDER BY c.created_at DESC;
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (err) {
    console.error('Error fetching user complaints:', err);
    throw err;
  }
};

// Update complaint status
const updateComplaintStatus = async (complaint_id, status) => {
  try {
    const query = `
      UPDATE complaints 
      SET status = $1, updated_at = NOW() 
      WHERE complaint_id = $2 
      RETURNING *;
    `;
    const result = await pool.query(query, [status, complaint_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error updating complaint status:', err);
    throw err;
  }
};

// Delete complaint
const deleteComplaint = async (complaint_id) => {
  try {
    const query = 'DELETE FROM complaints WHERE complaint_id = $1 RETURNING *;';
    const result = await pool.query(query, [complaint_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error deleting complaint:', err);
    throw err;
  }
};

// Get complaints by category with full details
const getComplaintsByCategory = async (category_id) => {
  try {
    const query = `
      SELECT c.*, u.name AS user_name, u.email AS user_email,
             COALESCE(
               json_agg(
                 json_build_object('category_id', cat.category_id, 'name', cat.name)
               ) FILTER (WHERE cat.category_id IS NOT NULL),
               '[]'
             ) AS categories
      FROM complaints c
      INNER JOIN complaint_categories cc ON c.complaint_id = cc.complaint_id
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN categories cat ON cc.category_id = cat.category_id
      WHERE cc.category_id = $1
      GROUP BY c.complaint_id, u.user_id
      ORDER BY c.created_at DESC;
    `;
    const result = await pool.query(query, [category_id]);
    return result.rows;
  } catch (err) {
    console.error('Error fetching complaints by category:', err);
    throw err;
  }
};

// Get complaints by status with categories
const getComplaintsByStatus = async (status) => {
  try {
    const query = `
      SELECT c.*, u.name AS user_name, u.email AS user_email,
             COALESCE(
               json_agg(
                 json_build_object('category_id', cat.category_id, 'name', cat.name)
               ) FILTER (WHERE cat.category_id IS NOT NULL),
               '[]'
             ) AS categories
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN complaint_categories cc ON c.complaint_id = cc.complaint_id
      LEFT JOIN categories cat ON cc.category_id = cat.category_id
      WHERE c.status = $1
      GROUP BY c.complaint_id, u.user_id
      ORDER BY c.created_at DESC;
    `;
    const result = await pool.query(query, [status]);
    return result.rows;
  } catch (err) {
    console.error('Error fetching complaints by status:', err);
    throw err;
  }
};

module.exports = {
  createComplaint,
  assignCategory,
  getAllComplaints,
  getComplaintById,
  getComplaintsByUserId,
  updateComplaintStatus,
  deleteComplaint,
  getComplaintsByCategory,
  getComplaintsByStatus,
};
