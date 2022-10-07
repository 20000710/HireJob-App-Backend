const express = require('express');

// controller here
const {
  register,
  login,
} = require('../controllers/auth.worker.controller');

const router = express.Router();

router
  .post('/worker/register',register)
  .post('/worker/login', login)

module.exports = router;