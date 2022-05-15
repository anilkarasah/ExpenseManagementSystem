const express = require('express');
const expenseController = require('../controllers/expenseController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    expenseController.listAllExpenses
  )
  .post(authController.protect, expenseController.newExpense);

router
  .route('/:id')
  .get(authController.protect, expenseController.listExpensesOfUser);

module.exports = router;
