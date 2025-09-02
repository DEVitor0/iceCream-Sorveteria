const { logAccess } = require('../services/loggerService');
const geoCheck = require('../services/geoCheckService');

module.exports = async (req, res, next) => {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.ip;
    const location = await geoCheck.getLocation(clientIp);

    if (location.region !== 'SP') {
      logAccess(req, 'denied', 'Fora de SP');
      return res.status(403).json({
        error: 'Acesso restrito',
        message: 'Disponível apenas para São Paulo',
        detectedRegion: location.region
      });
    }

    next();
  } catch (error) {
    console.error('Geo check failed:', error);
    next(); // Decide se permite ou não em caso de falha
  }
};
