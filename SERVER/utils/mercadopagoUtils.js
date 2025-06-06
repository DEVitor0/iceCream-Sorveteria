const { preference, payment } = require('../configs/mercadopagoConfig');
const ApiError = require('../utils/ApiError');

module.exports = {
  createPreference: async (preferenceData) => {
    try {
      const completePreference = {
        ...preferenceData,
        binary_mode: true,
        auto_return: "approved",
      };

      const response = await preference.create({ body: completePreference });
      return response;
    } catch (error) {
      console.error('Erro detalhado ao criar preferência:', {
        message: error.message,
        status: error.status,
        cause: error.cause
      });

      throw new ApiError(
        error.status || 500,
        error.message || 'Erro ao criar preferência de pagamento',
        { cause: error }
      );
    }
  },

  getPayment: async (paymentId) => {
    try {
      const response = await payment.get({ id: paymentId });
      return response;
    } catch (error) {
      console.error('Erro detalhado ao obter pagamento:', error);
      throw new ApiError(
        error.status || 500,
        error.message || 'Erro ao obter detalhes do pagamento',
        { cause: error }
      );
    }
  }
};
