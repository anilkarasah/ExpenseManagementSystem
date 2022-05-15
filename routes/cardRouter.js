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
  )
  .post(cardController.createCard);

router.route('/:id').get(cardController.getCardsOfUser);

router
  .route('/assign')
  .patch(authController.protect, cardController.assignCard);

module.exports = router;
