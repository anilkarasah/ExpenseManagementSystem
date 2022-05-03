const express = require('express');
const cardController = require('../controllers/cardController');

const router = express.Router();

router
  .route('/')
  .get(cardController.getAllCards)
  .post(cardController.createCard);

module.exports = router;
