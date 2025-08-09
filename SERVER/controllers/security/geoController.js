const axios = require('axios');
const createHttpError = require('http-errors');
const BlockedIP = require('../../model/blockedIP');
const { isIP } = require('net');

const verifyGeo = async (req, res, next) => {

  try {
    const clientIp = req.headers['x-real-ip'] ||
                     req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                     req.ip;

    // Check if IP is already blocked
    const isBlocked = await BlockedIP.findOne({ ip: clientIp });
    if (isBlocked) {
      return res.status(403).json({
        allowed: false,
        message: 'Acesso bloqueado permanentemente',
        errorType: 'IP_BLOCKED',
        clientIp,
      });
    }

    // Bypass for private/local IPs
    const isPrivateIP = (ip) => {
      if (!isIP(ip)) return false;
      if (ip.includes('.')) {
        const parts = ip.split('.').map(Number);
        return (
          parts[0] === 10 ||
          (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
          (parts[0] === 192 && parts[1] === 168) ||
          parts[0] === 127 ||
          parts[0] === 0
        );
      }
      return (
        ip === '::1' ||
        ip.startsWith('fc00:') ||
        ip.startsWith('fd00:') ||
        ip.startsWith('fe80:')
      );
    };

    if (isPrivateIP(clientIp)) {
      return res.json({
        allowed: true,
        message: 'IP local/privado - acesso permitido',
        clientIp,
      });
    }

    // Try primary API (ipapi.co with /json/)
    let countryCode;
    try {
      const response = await axios.get(`https://ipapi.co/${clientIp}/json/`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'nodejs-ipapi-v1.02',
          'Accept': 'application/json',
        },
      });

      if (response.data.error) {
        return res.json({
          allowed: true,
          message: 'IP reservado - acesso permitido',
          clientIp,
        });
      }

      countryCode = response.data.country_code;

      if (!countryCode) {
        throw new Error('Resposta inválida da API');
      }
    } catch (primaryError) {
      console.error('Erro com ipapi.co:', primaryError.message);

      // Fallback to ipinfo.io
      try {
        const fallbackResponse = await axios.get(`https://ipinfo.io/${clientIp}/json`, {
          timeout: 5000,
          headers: {
            'Authorization': `Bearer ${process.env.IPINFO_TOKEN}`,
            'Accept': 'application/json',
          },
        });

        if (fallbackResponse.data.bogon) {
          return res.json({
            allowed: true,
            message: 'IP reservado - acesso permitido',
            clientIp,
          });
        }

        countryCode = fallbackResponse.data.country;

        if (!countryCode) {
          throw new Error('Resposta inválida da API de fallback');
        }
      } catch (fallbackError) {
        console.error('Erro com ipinfo.io:', fallbackError.message);
        throw createHttpError.InternalServerError('Não foi possível verificar sua localização');
      }
    }

    if (countryCode !== 'BR') {
      try {
        await BlockedIP.create({
          ip: clientIp,
          reason: 'Acesso de fora do Brasil',
        });
        console.log(`IP ${clientIp} bloqueado e salvo no banco de dados`);
      } catch (err) {
        if (err.code !== 11000) {
          console.error('Erro ao salvar IP bloqueado:', err);
        }
      }

      return res.status(403).json({
        allowed: false,
        message: 'Acesso permitido apenas do Brasil',
        errorType: 'GEO_BLOCKED',
        clientIp,
        detectedCountry: countryCode,
      });
    }

    res.json({
      allowed: true,
      message: 'Acesso permitido - IP do Brasil',
      clientIp,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyGeo,
};
