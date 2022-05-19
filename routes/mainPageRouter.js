const express = require('express');
const mainController = require('../controllers/mainPageController');
const authController = require('../controllers/authController');
const expenseController = require('../controllers/expenseController');
const cardController = require('../controllers/cardController');

const router = express.Router();

router.get('/', authController.protect, mainController.mainPage);

router
  .route('/expense')
  .get(authController.protect, mainController.expensePage)
  .post(authController.protect, expenseController.newExpense);

router
  .route('/card')
  .get(authController.protect, mainController.cardPage)
  .post(authController.protect, cardController.newCard);

router.get('/subs', authController.protect, mainController.subsPage);

module.exports = router;
