const express = require('express');
const mainController = require('../controllers/mainPageController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.protect, mainController.mainPage);
router.get('/expense', authController.protect, mainController.expensePage);
router.get('/subs', authController.protect, mainController.subsPage);

module.exports = router;
