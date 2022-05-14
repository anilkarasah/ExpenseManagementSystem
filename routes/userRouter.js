const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(authController.protect, userController.getAllUsers);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/forgotPassword')
  .post(authController.forgotPassword)
  .patch(authController.resetPassword);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.route('/summaries').get(userController.listSummaries);
router.route('/summaries/:id').get(userController.listSummariesOfUser);

module.exports = router;
