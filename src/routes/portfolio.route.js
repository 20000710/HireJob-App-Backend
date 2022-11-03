const express = require('express');

// controller here
const {
  getAllPortfolio,
  portfolioDetail,
  portfolioInsert,
  portfolioUpdate,
  portfolioDelete,
  portfolioAdd,
} = require('../controllers/portfolio.controllers');

// middleware
const jwtAuth = require('../middlewares/JWTAuth');
const validationResult = require('../middlewares/validation');
const upload = require('../middlewares/upload');

const router = express.Router();

router
  .get('/', jwtAuth, getAllPortfolio) // to get all portfolio
  .get('/:id', jwtAuth, portfolioDetail) // to get portfolio detail by id
  .post('/', jwtAuth, upload, portfolioInsert) // to get create portfolio detail by id
  .put('/:id', jwtAuth, upload, validationResult, portfolioUpdate) // to update information portfolio
  .put('/add/:id', jwtAuth, upload, validationResult, portfolioAdd) // to add more portfolio
  .delete('/:id', jwtAuth, portfolioDelete) // to delete portfolio by id

  module.exports = router;
