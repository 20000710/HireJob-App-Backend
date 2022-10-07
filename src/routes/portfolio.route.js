const express = require('express');

// controller here
const {
  getAllPortfolio,
  portfolioDetail,
  portfolioInsert,
  portfolioUpdate,
  portfolioDelete,
} = require('../controllers/portfolio.controllers');

// middleware
const jwtAuth = require('../middlewares/JWTAuth');
const validationResult = require('../middlewares/validation');
const upload = require('../middlewares/upload');

const router = express.Router();

router
  .get('/portfolio', jwtAuth, getAllPortfolio) // to get all portfolio
  .get('/portfolio/:id', jwtAuth, portfolioDetail) // to get portfolio detail by id
  .post('/portfolio', jwtAuth, upload, portfolioInsert) // to get create portfolio detail by id
  .put('/portfolio/:id', jwtAuth, upload, validationResult, portfolioUpdate) // to update information portfolio
  .delete('/portfolio/:id', jwtAuth, portfolioDelete) // to delete portfolio by id

  module.exports = router;
