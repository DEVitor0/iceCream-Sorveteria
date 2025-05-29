const axios = require('axios');
const createHttpError = require('http-errors');

const verifyGeo = async (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    return res.json({
      allowed: true,
      message: 'Ambiente de desenvolvimento - verificação geográfica desativada'
    });
  }

  try {
    const clientIp = req.headers['x-real-ip'] ||
                   req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                   req.ip;

    if (clientIp === '127.0.0.1' || clientIp === '::1') {
      return res.json({
        allowed: true,
        message: 'IP local - acesso permitido'
      });
    }

    let countryCode;
    try {
      const response = await axios.get(`https://ipapi.co/${clientIp}/country/`, {
        timeout: 5000
      });
      countryCode = response.data;
    } catch (error) {
      console.error('Erro na API de geolocalização:', error);
      throw createHttpError.InternalServerError('Não foi possível verificar sua localização');
    }

    if (countryCode !== 'BR') {
      return res.status(403).json({
        allowed: false,
        message: 'Acesso permitido apenas do Brasil',
        errorType: 'GEO_BLOCKED',
        clientIp,
        detectedCountry: countryCode
      });
    }

    res.json({
      allowed: true,
      message: 'Acesso permitido - IP do Brasil'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyGeo
};
