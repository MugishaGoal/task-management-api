const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Retrieve the Authorization header from the request
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);

  // Extract the token from the Authorization header
  const token = authHeader ? authHeader.split(' ')[1] : null;
  console.log('Extracted Token:', token);

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    // Attach the decoded token to the request object
    req.user = decoded;
    // Call the next middleware function
    next();
  } catch (error) {
    // If token verification fails, return a 401 status with an error message
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
