const User = require('../../model/userModel');
const { fetchAddressByCEP } = require('../../utils/validation/cepService');
const sanitize = require('mongo-sanitize');

exports.getAddressByCEP = async (req, res) => {
  try {
    const { cep } = req.params;
    const cleanedCEP = cep.replace(/\D/g, '');

    if (cleanedCEP.length !== 8) {
      return res.status(400).json({ error: 'CEP deve conter 8 dígitos' });
    }

    const addressData = await fetchAddressByCEP(cleanedCEP);
    res.json(addressData);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar CEP', details: error.message });
  }
};

exports.addUserAddress = async (req, res) => {
  console.log('[BACK] addUserAddress - Iniciando');
  console.log('[BACK] User ID:', req.user._id);
  console.log('[BACK] Dados do endereço:', req.body);
  try {
    const userId = req.user._id;
    const addressData = sanitize(req.body);
    console.log('[BACK] Dados sanitizados:', addressData);

    if (!addressData.cep || !addressData.logradouro || !addressData.numero ||
        !addressData.bairro || !addressData.cidade || !addressData.estado) {
          console.log('[BACK] Campos obrigatórios faltando');
      return res.status(400).json({ error: 'Dados de endereço incompletos' });
    }

    const user = await User.findById(userId);
    console.log('[BACK] Usuário encontrado:', user ? user._id : 'Não encontrado');

    if (!user) {
      console.log('[BACK] Usuário não encontrado');
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.addresses.length === 0) {
      console.log('[BACK] Primeiro endereço - marcando como principal');
      addressData.principal = true;
    }

    user.addresses.push(addressData);
    console.log('[BACK] Endereço adicionado ao array - salvando...');
    await user.save();
    console.log('[BACK] Usuário salvo com sucesso');

    res.status(201).json(user.addresses[user.addresses.length - 1]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar endereço', details: error.message });
  }
};

exports.setMainAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const user = await User.findById(userId);

    user.addresses.forEach(addr => {
      addr.principal = false;
    });

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ error: 'Endereço não encontrado' });
    }

    address.principal = true;
    await user.save();

    res.json({ message: 'Endereço principal atualizado', address });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar endereço principal', details: error.message });
  }
};
