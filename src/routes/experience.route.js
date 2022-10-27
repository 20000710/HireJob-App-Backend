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
  .get('/', jwtAuth, getAllExperience) // to get all experience
  .get('/:id', jwtAuth, experienceDetail) // to get experience detail by id
  .post('/', jwtAuth, experienceInsert) // to get create experience detail by id
  .put('/:id', jwtAuth, validationResult, experienceUpdate) // to update information experience
  .delete('/:id', jwtAuth, experienceDelete) // to delete experience by id

  module.exports = router;
