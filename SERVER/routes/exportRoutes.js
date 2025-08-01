const express = require('express');
const router = express.Router();
const ExportController = require('../controllers/others/statistics/exportController');
const authenticateJWT = require('../middlewares/security/authMiddleware');
const csrfProtection = require('../configs/security/csrfProtectionConfigs');
const sanitizeMiddleware = require('../middlewares/security/sanitizeMiddleware');

router.use(authenticateJWT);
router.use(sanitizeMiddleware);
router.use(csrfProtection);

router.get('/', (req, res, next) =>
  ExportController.exportAllData(req, res, next));

module.exports = router;
