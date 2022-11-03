const express = require('express');

// controller here
const {
  getAllExperience,
  experienceDetail,
  experienceInsert,
  experienceUpdate,
  experienceAdd,
  experienceDelete,
//   workersUpdatePhoto,
} = require('../controllers/experience.controllers');

// middleware
const jwtAuth = require('../middlewares/JWTAuth');
const validationResult = require('../middlewares/validation');
const upload = require('../middlewares/upload');

const router = express.Router();

router
  .get('/', jwtAuth, getAllExperience) // to get all experience
  .get('/:id', jwtAuth, experienceDetail) // to get experience detail by id
  .post('/', jwtAuth, upload, experienceInsert) // to get create experience detail by id
  .put('/:id', jwtAuth, upload, validationResult, experienceUpdate) // to update information experience
  .put('/add/:id', jwtAuth, upload, validationResult, experienceAdd) // to add more experience
  .delete('/:id', jwtAuth, experienceDelete) // to delete experience by id

  module.exports = router;
