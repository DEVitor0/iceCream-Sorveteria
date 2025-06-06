const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// Configuração simplificada para produção
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 10000 // Aumente o timeout para 10 segundos
  }
});

module.exports = {
  client,
  preference: new Preference(client),
  payment: new Payment(client)
};
