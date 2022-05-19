const express = require('express');
const cardController = require('../controllers/cardController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    cardController.getAllCards
  );

router.get('/:id', cardController.getCardsOfUser);

module.exports = router;
