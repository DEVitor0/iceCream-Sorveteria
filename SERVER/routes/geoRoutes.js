const express = require('express');
const router = express.Router();
const geoController = require('../controllers/security/geoController');

router.get('/verify-geo', geoController.verifyGeo);

module.exports = router;
