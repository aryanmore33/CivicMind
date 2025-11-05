const { 
  toggleLike, 
  addComment, 
  getInteractions 
} = require('../models/interactionModels');

exports.toggleLike = async (req, res) => {
  try {
    console.log("🔑 JWT Payload:", req.user);
    console.log("👤 User ID:", req.user?.userId); // ✅ Changed from user_id to userId

    const { complaintId } = req.params;
    const userId = req.user?.userId; // ✅ Changed

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const result = await toggleLike(complaintId, userId);
    res.json(result);
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};

exports.addComment = async (req, res) => {
  try {
    console.log("🔑 JWT Payload:", req.user);
    console.log("👤 User ID:", req.user?.userId); // ✅ Changed

    const { complaintId } = req.params;
    const { commentText } = req.body;
    const userId = req.user?.userId; // ✅ Changed

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!commentText || commentText.trim().length === 0) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const result = await addComment(complaintId, userId, commentText);
    res.status(201).json(result);
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

exports.getInteractions = async (req, res) => {
  try {
    console.log("🔑 JWT Payload:", req.user);
    console.log("👤 User ID:", req.user?.userId); // ✅ Changed

    const { complaintId } = req.params;
    const userId = req.user?.userId; // ✅ Changed

    const result = await getInteractions(complaintId, userId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Get interactions error:", error);
    res.status(500).json({ error: "Failed to fetch interactions" });
  }
};
