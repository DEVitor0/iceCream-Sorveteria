const express = require('express');
const router = express.Router();
const addressController = require('../controllers/validation/addressController');
const { validateAddress } = require('../middlewares/validation/addressValidatorMiddleware');
const authenticateJWT = require('../middlewares/security/authMiddleware');
const sanitizeMiddleware = require('../middlewares/security/sanitizeMiddleware');
const csrfProtection = require('../configs/security/csrfProtectionConfigs');

router.get('/cep/:cep', authenticateJWT, addressController.getAddressByCEP);
router.post('/', authenticateJWT, sanitizeMiddleware, csrfProtection, validateAddress, addressController.addUserAddress);
router.patch('/principal/:addressId', authenticateJWT, sanitizeMiddleware, csrfProtection, addressController.setMainAddress);

module.exports = router;
