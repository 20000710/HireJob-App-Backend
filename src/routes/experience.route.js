const express = require('express');

// controller here
const {
  getAllExperience,
  experienceDetail,
  experienceInsert,
  experienceUpdate,
  experienceDelete,
//   workersUpdatePhoto,
} = require('../controllers/experience.controllers');

// middleware
const jwtAuth = require('../middlewares/JWTAuth');
const validationResult = require('../middlewares/validation');
// const upload = require('../middlewares/upload');

const router = express.Router();

router
  .get('/experiences', jwtAuth, getAllExperience) // to get all experience
  .get('/experiences/:id', jwtAuth, experienceDetail) // to get experience detail by id
  .post('/experiences', jwtAuth, experienceInsert) // to get create experience detail by id
  .put('/experiences/:id', jwtAuth, validationResult, experienceUpdate) // to update information experience
  .delete('/experiences/:id', jwtAuth, experienceDelete) // to delete experience by id

  module.exports = router;
