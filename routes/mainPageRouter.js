const express = require('express');
const mainController = require('../controllers/mainPageController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(authController.protect, mainController.getMainPage);

module.exports = router;
