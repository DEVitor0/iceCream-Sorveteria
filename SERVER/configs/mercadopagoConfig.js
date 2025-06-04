const { MercadoPagoConfig } = require('mercadopago');

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    integratorId: process.env.MERCADOPAGO_INTEGRATOR_ID,
  }
});

module.exports = mercadopago;
