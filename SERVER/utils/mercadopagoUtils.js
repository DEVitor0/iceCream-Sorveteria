const { Preference, Payment } = require('mercadopago');
const mercadopago = require('../configs/mercadopagoConfig');

module.exports = {
  createPreference: async (preferenceData) => {
    const preference = new Preference(mercadopago);
    return await preference.create({ body: preferenceData });
  },
  getPayment: async (paymentId) => {
    const payment = new Payment(mercadopago);
    return await payment.get({ id: paymentId });
  }
};
