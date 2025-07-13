const axios = require('axios');

exports.fetchAddressByCEP = async (cep) => {
  try {
    const cleanedCEP = cep.replace(/\D/g, '');
    const response = await axios.get(`https://viacep.com.br/ws/${cleanedCEP}/json/`);

    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      cep: response.data.cep,
      logradouro: response.data.logradouro,
      bairro: response.data.bairro,
      cidade: response.data.localidade,
      estado: response.data.uf
    };
  } catch (error) {
    console.error('Erro na API de CEP:', error.message);
    throw error;
  }
};
