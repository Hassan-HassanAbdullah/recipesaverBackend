// middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    console.log('Access Denied: No token provided');
    return res.status(401).json({ error: 'Access Denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // user object attach ho gaya
    console.log('User authenticated:', req.user);
    // Next middleware ya route handler ko call karte hain  
    next();
  } catch (err) {
    console.log('❌ Invalid Token:', err.message);
    res.status(400).json({ error: 'Invalid Token' });
  }
};
