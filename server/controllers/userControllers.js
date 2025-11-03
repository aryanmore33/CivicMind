require('dotenv').config();

const userModel = require('../models/userModels');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

dotenv.config();

const registerUser = async (req, res) => {
  const { name, email, password, phone_number, city, role } = req.body;

  // Validation based on role
  if (role === 'authority') {
    if (!name || !email || !password || !phone_number) {
      console.log('All fields are required for authority registration!');
      return res.status(400).json({ error: 'Name, email, password, and phone are required for authorities' });
    }
  } else {
    // For citizens - only basic fields required
    if (!name || !email || !password) {
      console.log('All fields are required!');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password with bcrypt (saltRounds = 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password.toString(), saltRounds);

    // Create new user with CivicMind schema fields
    const newUser = await userModel.createUser(
      name,
      email,
      passwordHash,
      role || 'citizen',  // Default to citizen if not specified
      phone_number || null,
      city || null
    );

    if (newUser) {
      // Optional: Clear cache if you're using caching
      // await clearUserCache();

      // Optional: Log activity for audit trail
      // await logActivity({
      //   user_id: newUser.user_id,
      //   activity: 'User Registration',
      //   status: 'success',
      //   details: `${role || 'citizen'} registered successfully`,
      // });

      // Don't send password in response
      const { password_hash, ...userResponse } = newUser;

      return res.status(201).json({
        message: 'User registered successfully',
        user: userResponse
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Login User Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password using bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Prepare user data for JWT
    const userData = {
      userId: user.user_id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Generate JWT token
    const token = jwt.sign(
      userData,
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',  // Token valid for 7 days
        algorithm: 'HS256'
      }
    );

    // Set HTTP-only cookie for security
    res.cookie('jwttoken', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production', // true in production
    });

    // Return success response
    return res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone_number: user.phone_number,
        city: user.city,
        profile_pic: user.profile_pic,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};







module.exports = { 
    registerUser,
    loginUser,

};