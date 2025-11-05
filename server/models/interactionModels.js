const pool = require('../config/pool');

// ✅ MODEL 1: Toggle Like
exports.toggleLike = async (complaintId, userId) => {
  try {
    const existingLike = await pool.query(
      `SELECT interaction_id FROM interactions 
       WHERE complaint_id = $1 AND user_id = $2 AND type = 'like'`,
      [complaintId, userId]
    );

    if (existingLike.rows.length > 0) {
      await pool.query(
        `DELETE FROM interactions 
         WHERE complaint_id = $1 AND user_id = $2 AND type = 'like'`,
        [complaintId, userId]
      );
      return { success: true, action: "unliked", liked: false };
    } else {
      await pool.query(
        `INSERT INTO interactions (complaint_id, user_id, type) 
         VALUES ($1, $2, 'like')`,
        [complaintId, userId]
      );
      return { success: true, action: "liked", liked: true };
    }
  } catch (error) {
    throw error;
  }
};

// ✅ Check if user has liked
exports.hasUserLiked = async (complaintId, userId) => {
  try {
    const result = await pool.query(
      `SELECT interaction_id FROM interactions 
       WHERE complaint_id = $1 AND user_id = $2 AND type = 'like'`,
      [complaintId, userId]
    );
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
};

// ✅ MODEL 2: Add Comment
exports.addComment = async (complaintId, userId, commentText) => {
  try {
    const result = await pool.query(
      `INSERT INTO interactions (complaint_id, user_id, type, comment_text) 
       VALUES ($1, $2, 'comment', $3)
       RETURNING interaction_id, created_at`,
      [complaintId, userId, commentText]
    );

    return {
      success: true,
      interaction_id: result.rows[0].interaction_id,
      comment_text: commentText,
      created_at: result.rows[0].created_at,
    };
  } catch (error) {
    throw error;
  }
};


// ✅ Get all interactions WITH user-specific info
exports.getInteractions = async (complaintId, userId = null) => {
  try {
    console.log("🔍 Fetching interactions for complaint:", complaintId);
    
    // ✅ Use LEFT JOIN so it doesn't fail if user is deleted
    const result = await pool.query(
      `SELECT 
        i.interaction_id,
        i.type,
        i.comment_text,
        i.created_at,
        i.user_id,
        COALESCE(u.name, 'Anonymous') as user_name
      FROM interactions i
      LEFT JOIN users u ON i.user_id = u.user_id
      WHERE i.complaint_id = $1
      ORDER BY i.created_at DESC`,
      [complaintId]
    );

    console.log("✅ Raw DB result count:", result.rows.length);
    console.log("✅ Raw DB result:", result.rows);

    const likes = result.rows.filter(r => r.type === 'like');
    const comments = result.rows.filter(r => r.type === 'comment');

    console.log("📊 Likes:", likes.length, "Comments:", comments.length);

    const currentUserLiked = userId ? likes.some(l => l.user_id === userId) : false;

    return {
      success: true,
      likes_count: likes.length,
      comments_count: comments.length,
      current_user_liked: currentUserLiked,
      comments: comments.map(c => ({
        interaction_id: c.interaction_id,
        user_name: c.user_name,
        user_id: c.user_id,
        comment_text: c.comment_text,
        created_at: c.created_at,
      })),
    };
  } catch (error) {
    console.error("❌ Database error:", error.message);
    throw error;
  }
};



// ✅ HELPER: Get Like Count
exports.getLikeCount = async (complaintId) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM interactions 
       WHERE complaint_id = $1 AND type = 'like'`,
      [complaintId]
    );
    return result.rows[0].count;
  } catch (error) {
    throw error;
  }
};

// ✅ HELPER: Get Comment Count
exports.getCommentCount = async (complaintId) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM interactions 
       WHERE complaint_id = $1 AND type = 'comment'`,
      [complaintId]
    );
    return result.rows[0].count;
  } catch (error) {
    throw error;
  }
};

