const express = require('express');
const router = express.Router();
const clientAdminController = require('../controllers/clientAdminController');
const authenticateJWT = require('../middlewares/authMiddleware');

router.use(authenticateJWT);

router.get('/clients', clientAdminController.getAllClients);
router.get('/clients/search', clientAdminController.searchClients);
router.get('/clients/:userId', clientAdminController.getClientDetails);
router.post('/clients/send-email', clientAdminController.sendEmailToClient);

module.exports = router;
