const axios = require('axios');
const createHttpError = require('http-errors');

const verifyGeo = async (req, res, next) => {
  try {
    const clientIp = req.headers['x-real-ip'] ||
                     req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                     req.ip;

    let countryCode;
    try {
      const response = await axios.get(`https://ipapi.co/${clientIp}/country/`, {
        timeout: 3000
      });
      countryCode = response.data;
    } catch (primaryError) {
      console.log('Falha com ipapi.co, tentando ipinfo.io...');
      try {
        const fallbackResponse = await axios.get(`https://ipinfo.io/${clientIp}/country`, {
          timeout: 3000,
          headers: { 'Authorization': `Bearer ${process.env.IPINFO_TOKEN}` }
        });
        countryCode = fallbackResponse.data.trim();
      } catch (fallbackError) {
        console.error('Ambas APIs falharam:', { primaryError, fallbackError });
        throw createHttpError.Forbidden('Não foi possível verificar sua localização');
      }
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
