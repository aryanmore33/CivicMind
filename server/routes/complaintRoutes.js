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

// ✅ POST /api/complaints - Create new complaint
router.post('/', jwtAuthMiddleware, upload.single('image'), createComplaint);

// ✅ SPECIFIC ROUTES FIRST
router.get('/my', jwtAuthMiddleware, getMyComplaints);
router.get('/category/:category_id', jwtAuthMiddleware, getComplaintsByCategory);
router.get('/status/:status', jwtAuthMiddleware, getComplaintsByStatus);

// ✅ GENERIC ROUTES LAST
router.get('/', jwtAuthMiddleware, getAllComplaints);
router.get('/:complaintId', jwtAuthMiddleware, getComplaintById); // ✅ Changed from :id

// ✅ PUT - Update status
router.put('/:complaintId/status', jwtAuthMiddleware, authorityOnly, updateComplaintStatus); // ✅ Changed

// ✅ DELETE
router.delete('/:complaintId', jwtAuthMiddleware, deleteComplaint); // ✅ Changed

module.exports = router;
