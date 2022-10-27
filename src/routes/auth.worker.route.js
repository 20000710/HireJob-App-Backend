const express = require('express');

// controller here
const {
  register,
  login,
} = require('../controllers/auth.worker.controller');

const router = express.Router();

router.post('/register',register)
router.post('/login', login)

module.exports = router;