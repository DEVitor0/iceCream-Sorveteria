const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { validateAddress } = require('../middlewares/addressValidatorMiddleware');
const authenticateJWT = require('../middlewares/authMiddleware');
const sanitizeMiddleware = require('../middlewares/sanitizeMiddleware');
const csrfProtection = require('../configs/csrfProtectionConfigs');

router.get('/cep/:cep', authenticateJWT, addressController.getAddressByCEP);
router.post('/', authenticateJWT, sanitizeMiddleware, csrfProtection, validateAddress, addressController.addUserAddress);
router.patch('/principal/:addressId', authenticateJWT, sanitizeMiddleware, csrfProtection, addressController.setMainAddress);

module.exports = router;