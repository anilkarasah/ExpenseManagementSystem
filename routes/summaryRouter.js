const express = require('express');
const summaryController = require('../controllers/summaryController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    summaryController.listSummaries
  );
router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    summaryController.listSummariesOfUser
  );

module.exports = router;
