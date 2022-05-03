const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(userController.getAllUsers);

router.route('/signup').post(authController.signup);

router.route('/assignCard/:id').patch(userController.assignCard);

module.exports = router;
