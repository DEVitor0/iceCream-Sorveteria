const express = require("express");
const router = express.Router();
const { login } = require('../controllers/validation/authLoginController');
const { validateUserCredentials } = require('../controllers/validation/userController');

router.post('/authentication/validate', validateUserCredentials);
router.post('/login', login);

module.exports = router;
