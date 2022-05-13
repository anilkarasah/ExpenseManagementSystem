const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(userController.getAllUsers);

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router
  .route('/forgotPassword')
  .post(authController.forgotPassword)
  .patch(authController.resetPassword);

router.route('/assignCard/:id').patch(userController.assignCard);

router.route('/summaries').get(userController.listSummaries);
router.route('/summaries/:id').get(userController.listSummariesOfUser);

module.exports = router;
