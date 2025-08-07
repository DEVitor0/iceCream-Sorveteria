const axios = require('axios');
const createHttpError = require('http-errors');
const BlockedIP = require('../../model/blockedIP');

const geoRestrictionMiddleware = async (req, res, next) => {
  try {
    const clientIp = req.headers['x-real-ip'] ||
                   req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                   req.ip;

    const isBlocked = await BlockedIP.findOne({ ip: clientIp });
    if (isBlocked) {
      return res.status(403).json({
        allowed: false,
        message: 'Acesso bloqueado permanentemente',
        errorType: 'IP_BLOCKED',
        clientIp,
      });
    }

    let countryCode;
    try {
      const response = await axios.get(`https://ipapi.co/${clientIp}/country/`, { timeout: 5000 });
      countryCode = response.data;
    } catch (error) {
      console.error('Erro na API de geolocalização:', error);
      throw createHttpError.Forbidden('Não foi possível verificar sua localização');
    }

    if (countryCode !== 'BR') {
      try {
        await BlockedIP.create({
          ip: clientIp,
          reason: 'Acesso de fora do Brasil'
        });
        console.log(`IP ${clientIp} bloqueado e salvo no banco de dados.`);
      } catch (err) {
        if (err.code !== 11000) {
          console.error('Erro ao salvar IP bloqueado no banco:', err);
        }
      }

      return res.status(403).json({
        allowed: false,
        message: 'Acesso permitido apenas do Brasil. IP bloqueado.',
        errorType: 'GEO_BLOCKED',
        clientIp,
        detectedCountry: countryCode,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = geoRestrictionMiddleware;
