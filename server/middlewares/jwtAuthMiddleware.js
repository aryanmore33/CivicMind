const jwt = require('jsonwebtoken');

// ✅ Basic JWT Authentication
const jwtAuthMiddleware = (req, res, next) => {
  let token = null;
  
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  
  if (!token && req.cookies && req.cookies.jwttoken) {
    token = req.cookies.jwttoken;
  }

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired. Please login again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token.' 
      });
    }
    
    return res.status(401).json({ 
      error: 'Authentication failed.' 
    });
  }
};

// ✅ Authority/Admin Only Middleware
const authorityOnly = (req, res, next) => {
  if (req.user.role !== 'authority' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied. Authorities only.' 
    });
  }
  next();
};

// ✅ Admin Only Middleware
const adminOnly = (req, res, next) => {
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
