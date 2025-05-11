const axios = require('axios');
const createHttpError = require('http-errors');

const geoRestrictionMiddleware = async (req, res, next) => {
  console.log('=== INÍCIO DA VERIFICAÇÃO GEOGRÁFICA ===');
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);

  // Permite acesso em desenvolvimento ou para IPs locais
  if (process.env.NODE_ENV !== 'production') {
    console.log('Ambiente não-produção - acesso permitido sem verificação geográfica');
    return next();
  }

  try {
    console.log('Verificação geográfica ativada (ambiente de produção)');

    const clientIp = req.headers['x-real-ip'] ||
                   req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                   req.ip;

    console.log('IP detectado:', clientIp);

    // Ignora IPs locais mesmo em produção (opcional)
    if (clientIp === '127.0.0.1' || clientIp === '::1') {
      console.log('IP local detectado - acesso permitido');
      return next();
    }

    let countryCode;
    try {
      const response = await axios.get(`https://ipapi.co/${clientIp}/country/`, {
        timeout: 5000
      });
      countryCode = response.data;
      console.log('País detectado:', countryCode);
    } catch (error) {
      console.error('Erro na API de geolocalização:', error);
      throw createHttpError.Forbidden('Não foi possível verificar sua localização');
    }

    if (countryCode !== 'BR') {
      console.log(`Bloqueio geográfico para IP ${clientIp} (${countryCode})`);
      throw createHttpError.Forbidden('Acesso permitido apenas do Brasil', {
        errorType: 'GEO_BLOCKED',
        detectedCountry: countryCode,
        clientIp
      });
    }

    console.log('Acesso permitido - IP do Brasil');
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = geoRestrictionMiddleware;
