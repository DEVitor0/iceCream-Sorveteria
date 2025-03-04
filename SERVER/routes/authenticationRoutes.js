const express = require("express");
const router = express.Router();
const { login } = require('../controllers/authController');
const { validateUserCredentials } = require('../controllers/userController');

router.post('/authentication/validate', validateUserCredentials);
router.post('/login', login);

module.exports = router;
