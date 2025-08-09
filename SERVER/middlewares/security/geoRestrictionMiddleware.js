const axios = require('axios');
const createHttpError = require('http-errors');
const BlockedIP = require('../../model/blockedIP');
const { isIP } = require('net');

const geoRestrictionMiddleware = async (req, res, next) => {
  console.log('=== INÍCIO DA VERIFICAÇÃO GEOGRÁFICA ===');

  try {
    // PRIORIDADE: IP de teste vindo da query ou header (manual)
    const testIp = req.query.testIp || req.headers['x-test-ip'];

    // Valida se o IP fornecido manualmente é válido
    if (testIp && !isIP(testIp)) {
      return res.status(400).json({ error: 'IP de teste inválido' });
    }

    // Se tem IP manual válido, usa ele, senão usa o IP real da requisição
    const clientIp = testIp ||
                     req.headers['x-real-ip'] ||
                     req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                     req.ip;

    console.log('IP detectado para verificação:', clientIp);

    // Verifica se IP já está bloqueado
    const isBlocked = await BlockedIP.findOne({ ip: clientIp });
    if (isBlocked) {
      console.log(`IP ${clientIp} já está bloqueado`);
      throw createHttpError.Forbidden('Acesso bloqueado permanentemente', {
        errorType: 'IP_BLOCKED',
        clientIp,
      });
    }

    // Função para checar IP privado/local
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
      console.log(`IP local/privado detectado: ${clientIp} - acesso permitido`);
      return next();
    }

    // Consulta a API para geolocalização
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
        console.warn(`IP reservado detectado: ${clientIp} - ${response.data.reason}`);
        return next(); // permite IP reservado (ex: privado)
      }

      countryCode = response.data.country_code;
      console.log('País detectado:', countryCode);

      if (!countryCode) {
        throw new Error('Resposta inválida da API');
      }
    } catch (primaryError) {
      console.error('Erro com ipapi.co:', primaryError.message);

      // fallback para ipinfo.io
      try {
        const fallbackResponse = await axios.get(`https://ipinfo.io/${clientIp}/json`, {
          timeout: 5000,
          headers: {
            'Authorization': `Bearer ${process.env.IPINFO_TOKEN}`,
            'Accept': 'application/json',
          },
        });

        if (fallbackResponse.data.bogon) {
          console.warn(`IP reservado detectado via fallback: ${clientIp}`);
          return next();
        }

        countryCode = fallbackResponse.data.country;
        console.log('País detectado (fallback):', countryCode);

        if (!countryCode) {
          throw new Error('Resposta inválida da API de fallback');
        }
      } catch (fallbackError) {
        console.error('Erro com ipinfo.io:', fallbackError.message);
        throw createHttpError.Forbidden('Não foi possível verificar sua localização');
      }
    }

    if (countryCode !== 'BR') {
      console.log(`Bloqueio geográfico para IP ${clientIp} (${countryCode})`);
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

      throw createHttpError.Forbidden('Acesso permitido apenas do Brasil', {
        errorType: 'GEO_BLOCKED',
        detectedCountry: countryCode,
        clientIp,
      });
    }

    console.log('Acesso permitido - IP do Brasil');
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = geoRestrictionMiddleware;
