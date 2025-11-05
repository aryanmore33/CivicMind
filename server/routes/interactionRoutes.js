const express = require('express');
const router = express.Router();

console.log("✅ interactionRoutes.js LOADED"); // ✅ Verify file loads

const { jwtAuthMiddleware } = require('../middlewares/jwtAuthMiddleware');
const { 
  toggleLike, 
  addComment, 
  getInteractions 
} = require('../controllers/interactionController');

// ✅ Global logger for all requests
router.use((req, res, next) => {
  console.log("🔥 Interaction Route Matched:", req.method, req.originalUrl);
  next();
});

// ✅ Toggle Like
router.post('/:complaintId/like', jwtAuthMiddleware, toggleLike);

// ✅ Add Comment
router.post('/:complaintId/comment', jwtAuthMiddleware, addComment);

// ✅ Get Interactions
router.get('/:complaintId/interactions', jwtAuthMiddleware, getInteractions);

module.exports = router;
