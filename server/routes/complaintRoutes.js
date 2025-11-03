const express = require('express');
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getMyComplaints,
  updateComplaintStatus,
  deleteComplaint,
  getComplaintsByCategory,
  getComplaintsByStatus,
} = require('../controllers/complaintController');
const { jwtAuthMiddleware, authorityOnly } = require('../middlewares/jwtAuthMiddleware');
const upload = require('../middlewares/uploadComplaint');

const router = express.Router();

// ✅ POST /api/complaints - Create new complaint (with image upload)
router.post('/', jwtAuthMiddleware, upload.single('image'), createComplaint);

// ✅ GET /api/complaints - Get all complaints
router.get('/', jwtAuthMiddleware, getAllComplaints);

// ✅ GET /api/complaints/my - Get logged-in user's complaints
router.get('/my', jwtAuthMiddleware, getMyComplaints);

// ✅ GET /api/complaints/category/:category_id - Get complaints by category
router.get('/category/:category_id', jwtAuthMiddleware, getComplaintsByCategory);

// ✅ GET /api/complaints/status/:status - Get complaints by status
router.get('/status/:status', jwtAuthMiddleware, getComplaintsByStatus);

// ✅ GET /api/complaints/:id - Get single complaint
router.get('/:id', jwtAuthMiddleware, getComplaintById);

// ✅ PUT /api/complaints/:id/status - Update complaint status (Authority only)
router.put('/:id/status', jwtAuthMiddleware,authorityOnly, updateComplaintStatus);

// ✅ DELETE /api/complaints/:id - Delete complaint
router.delete('/:id', jwtAuthMiddleware, deleteComplaint);

module.exports = router;
