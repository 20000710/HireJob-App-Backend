const express = require('express');

// controller here
const {
  getAllWorkers,
  workersDetail,
  workersUpdate,
  workersUpdatePhoto,
//   workersDelete,
} = require('../controllers/worker.controllers');

// middleware
const jwtAuth = require('../middlewares/JWTAuth');
const validationResult = require('../middlewares/validation');
const upload = require('../middlewares/upload');

const router = express.Router();

router
  .get('/workers', getAllWorkers) // to get all users
  .get('/workers/:id', jwtAuth, workersDetail) // to get users detail by id
  .put('/workers', jwtAuth, validationResult, workersUpdate) // to update information users
  .put('/workers-photo', jwtAuth, upload, workersUpdatePhoto)

  module.exports = router;
