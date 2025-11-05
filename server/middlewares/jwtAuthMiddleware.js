const jwt = require('jsonwebtoken');

// ✅ Basic JWT Authentication
const jwtAuthMiddleware = (req, res, next) => {
  let token = null;
  
  const authHeader = req.headers.authorization;
  
  console.log("🔍 Auth Header received:", authHeader ? authHeader.substring(0, 30) + "..." : "NO HEADER"); // ✅ Debug
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7); // ✅ Use slice instead of split for safety
    console.log("✅ Token extracted from Bearer:", token.substring(0, 20) + "..."); // ✅ Debug
  }
  
  if (!token && req.cookies && req.cookies.jwttoken) {
    token = req.cookies.jwttoken;
    console.log("✅ Token extracted from cookie:", token.substring(0, 20) + "..."); // ✅ Debug
  }

  if (!token) {
    console.error("❌ No token found"); // ✅ Debug
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    });
  }

  try {
    console.log("🔐 JWT_SECRET exists:", !!process.env.JWT_SECRET); // ✅ Debug
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("✅ JWT verified successfully:", decoded); // ✅ Debug
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message); // ✅ Debug
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired. Please login again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token.',
        details: error.message
      });
    }
    
    return res.status(401).json({ 
      error: 'Authentication failed.',
      details: error.message
    });
  }
};

// ✅ Authority/Admin Only Middleware
const authorityOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  
  if (req.user.role !== 'authority' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied. Authorities only.' 
    });
  }
  next();
};

// ✅ Admin Only Middleware
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied. Admins only.' 
    });
  }
  next();
};

module.exports = { 
  jwtAuthMiddleware, 
  authorityOnly, 
  adminOnly 
};
