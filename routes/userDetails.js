const route = require('express').Router();
const { signIn, signUp, tokenVerification } = require('../controller/userController');
const {authenticateToken} = require('../middleware/authentication');

  route.post('/signin',signIn)
  route.post('/signup',signUp)
  route.get('/protected', authenticateToken,tokenVerification)
  
  module.exports = route;