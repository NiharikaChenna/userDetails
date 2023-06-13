const jwt = require('jsonwebtoken')
const {jwtSecret} = require('../config/config')

// Middleware function to authenticate a token
function authenticateToken(req, res, next) {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
        // Return an error response if no token is provided
        return res.status(403).send({
          message: "No token provided!",
        });
      }
  
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        // Return an error response if the token is invalid or expired
        return res.status(401).send({
          message: "Unauthorized!",
          error: err.message
        });
      }
          // Token is valid, attach the user object to the request for further processing
          req.user = user;
          next();
       });
    }
  
  module.exports = {authenticateToken}