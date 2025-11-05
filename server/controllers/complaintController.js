const complaintModel = require('../models/complaintModel');
const categoryModel = require('../models/categoryModels');
const { detectCategoriesWithAI } = require('../utils/aiCategoryDetector');

// ✅ CREATE COMPLAINT WITH AI MULTI-CATEGORY DETECTION
const createComplaint = async (req, res) => {
  try {
    const { title, description, latitude, longitude, address } = req.body;
    const user_id = req.user.userId;

    if (!title || !description) {
      return res.status(400).json({ 
        error: 'Title and description are required' 
      });
    }

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/complaints/${req.file.filename}`;
    }

    console.log('Creating complaint...');
    const newComplaint = await complaintModel.createComplaint(
      user_id,
      title,
      description,
      image_url,
      latitude,
      longitude,
      address
    );

    console.log(`Complaint created with ID: ${newComplaint.complaint_id}`);

    console.log('Detecting categories with AI...');
    const detectedCategories = await detectCategoriesWithAI(title, description);
    
    console.log(`AI detected ${detectedCategories.length} categories:`, 
                detectedCategories.map(c => c.category_name).join(', '));

    for (const category of detectedCategories) {
      await complaintModel.assignCategory(
        newComplaint.complaint_id, 
        category.category_id
      );
      console.log(`Linked to category: ${category.category_name}`);
    }

    const complaintWithCategories = await complaintModel.getComplaintById(
      newComplaint.complaint_id
    );

    return res.status(201).json({
      message: 'Complaint created successfully with AI classification',
      complaint: complaintWithCategories,
      ai_classification: {
        total_categories: detectedCategories.length,
        detected_categories: detectedCategories.map(c => ({
          id: c.category_id,
          name: c.category_name,
          is_new: c.is_new
        })),
        new_categories_created: detectedCategories
          .filter(c => c.is_new)
          .map(c => c.category_name)
      }
    });

  } catch (error) {
    console.error('Create complaint error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// ✅ GET ALL COMPLAINTS
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await complaintModel.getAllComplaints();

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });

  } catch (error) {
    console.error('Get complaints error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ GET COMPLAINT BY ID - FIX: Use complaintId not id
const getComplaintById = async (req, res) => {
  try {
    const { complaintId } = req.params; // ✅ Fixed

    const complaint = await complaintModel.getComplaintById(complaintId); // ✅ Fixed

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });

  } catch (error) {
    console.error('Get complaint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ GET MY COMPLAINTS (Logged-in user)
const getMyComplaints = async (req, res) => {
  try {
    const user_id = req.user.userId;

    const complaints = await complaintModel.getComplaintsByUserId(user_id);

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });

  } catch (error) {
    console.error('Get user complaints error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ UPDATE COMPLAINT STATUS - FIX: Use complaintId not id
const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params; // ✅ Fixed

    const { status } = req.body;

    if (req.user.role !== 'authority' && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. Authorities only.' 
      });
    }

    const validStatuses = ['pending', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const updatedComplaint = await complaintModel.updateComplaintStatus(complaintId, status); // ✅ Fixed

    if (!updatedComplaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const complaintWithDetails = await complaintModel.getComplaintById(complaintId); // ✅ Fixed

    return res.status(200).json({
      message: 'Complaint status updated successfully',
      complaint: complaintWithDetails,
    });

  } catch (error) {
    console.error('Update complaint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ DELETE COMPLAINT - FIX: Use complaintId not id
const deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params; // ✅ Fixed
    const user_id = req.user.userId;
    const user_role = req.user.role;

    const complaint = await complaintModel.getComplaintById(complaintId); // ✅ Fixed

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    if (complaint.user_id !== user_id && user_role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. You can only delete your own complaints.' 
      });
    }

    await complaintModel.deleteComplaint(complaintId); // ✅ Fixed

    return res.status(200).json({
      message: 'Complaint deleted successfully',
      deleted_complaint_id: complaintId // ✅ Fixed
    });

  } catch (error) {
    console.error('Delete complaint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ GET COMPLAINTS BY CATEGORY
const getComplaintsByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;

    const complaints = await complaintModel.getComplaintsByCategory(category_id);

    return res.status(200).json({
      success: true,
      category_id: parseInt(category_id),
      count: complaints.length,
      complaints,
    });

  } catch (error) {
    console.error('Get complaints by category error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ GET COMPLAINTS BY STATUS
const getComplaintsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const validStatuses = ['pending', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const complaints = await complaintModel.getComplaintsByStatus(status);

    return res.status(200).json({
      success: true,
      status: status,
      count: complaints.length,
      complaints,
    });

  } catch (error) {
    console.error('Get complaints by status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getMyComplaints,
  updateComplaintStatus,
  deleteComplaint,
  getComplaintsByCategory,
  getComplaintsByStatus,
};
