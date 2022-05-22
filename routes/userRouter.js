const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

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

router.patch(
  '/grantRole',
  authController.protect,
  authController.restrictTo('admin'),
  authController.grantRole
);

router.patch('/updateMe', authController.protect, userController.updateMe);

module.exports = router;
