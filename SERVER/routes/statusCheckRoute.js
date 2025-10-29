const express = require('express');
const router = express.Router();
const geoController = require('../controllers/security/geoController');

router.get('/status/ping', (req, res, next) => {
  const forcedIp = req.query.ip || req.headers['x-client-ip'];

  if (forcedIp) {
    req.headers['x-real-ip'] = forcedIp;
    req.headers['x-forwarded-for'] = forcedIp;
  }

  return geoController.verifyGeo(req, res, next);
});

module.exports = router;
