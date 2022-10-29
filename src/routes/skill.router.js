const express = require('express');

// controller here
const {
  getAllSkills,
  skillDetail,
  skillsInsert,
  skillUpdate,
  skillDelete,
} = require('../controllers/skill.controllers');

// middleware
const jwtAuth = require('../middlewares/JWTAuth');

const router = express.Router();

router
  .get('/', jwtAuth, getAllSkills) // to get all skill
  .get('/:id', jwtAuth, skillDetail) // to get skill detail by id
  .post('/', jwtAuth, skillsInsert) // to get create skill detail by id
  .put('/:id', jwtAuth, skillUpdate) // to update information skill
  .delete('/:id', jwtAuth, skillDelete) // to delete skill by id

module.exports = router;
