const express = require('express');
const axios = require('axios');
const { isIP } = require('net');
const BlockedIP = require('../../model/blockedIP');

const router = express.Router();

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

router.get('/api/geo-verification', async (req, res) => {
  try {
    const testIp = req.query.ip || req.headers['x-test-ip'];

    if (!testIp) {
      return res.status(400).json({ error: 'Informe o IP para testar (query "ip" ou header "x-test-ip")' });
    }

    if (!isIP(testIp)) {
      return res.status(400).json({ error: 'IP inválido' });
    }

    if (isPrivateIP(testIp)) {
      return res.json({
        allowed: true,
        message: 'IP local/privado - acesso permitido',
        ip: testIp,
      });
    }

    let countryCode;
    try {
      const response = await axios.get(`https://ipapi.co/${testIp}/json/`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'nodejs-ipapi-v1.02',
          'Accept': 'application/json',
        },
      });

      if (response.data.error) {
        return res.json({
          allowed: true,
          message: 'IP reservado ou erro na API - acesso permitido',
          ip: testIp,
        });
      }

      countryCode = response.data.country_code;
      if (!countryCode) throw new Error('Resposta inválida da API');
    } catch (errPrimary) {
      try {
        const fallbackResponse = await axios.get(`https://ipinfo.io/${testIp}/json`, {
          timeout: 5000,
          headers: {
            'Authorization': `Bearer ${process.env.IPINFO_TOKEN}`,
            'Accept': 'application/json',
          },
        });

        if (fallbackResponse.data.bogon) {
          return res.json({
            allowed: true,
            message: 'IP reservado via fallback - acesso permitido',
            ip: testIp,
          });
        }

        countryCode = fallbackResponse.data.country;
        if (!countryCode) throw new Error('Resposta inválida da API de fallback');
      } catch (errFallback) {
        return res.status(500).json({ error: 'Erro ao verificar o IP' });
      }
    }

    if (countryCode === 'BR') {
      return res.json({
        allowed: true,
        message: 'IP do Brasil - acesso permitido',
        ip: testIp,
        country: countryCode,
      });
    } else {
      try {
        await BlockedIP.create({
          ip: testIp,
          reason: 'Acesso de fora do Brasil',
        });
      } catch (e) {
        if (e.code === 11000) {
          console.log(`IP ${testIp} já está bloqueado no banco.`);
        } else {
          console.error('Erro ao salvar IP bloqueado:', e);
        }
      }

      return res.json({
        allowed: false,
        message: 'IP fora do Brasil - acesso negado',
        ip: testIp,
        country: countryCode,
      });
    }
  } catch (error) {
    console.error('Erro na rota /api/geo-verification:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;
