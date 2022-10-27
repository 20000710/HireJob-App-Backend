const express = require('express');

// controller here
const {
  register,
  login,
} = require('../controllers/auth.recruiter.controllers');

const router = express.Router();

router
  .post('/register',register)
  .post('/login', login)

module.exports = router;