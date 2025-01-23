const User = require('../model/userModel');

const validateUserCredentials = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return generateErrorResponse(res, 'Todos os campos são obrigatórios.');
    }

    const user = await User.findOne({ username });
    if (!user) {
      return generateErrorResponse(res, 'Usuário não encontrado.');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return generateErrorResponse(res, 'Senha incorreta.');
    }

    res.status(200).json({ message: 'Login realizado com sucesso!' });
  } catch (error) {
    console.error('Erro na validação do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const generateErrorResponse = (res, message) => {
  return res.status(400).json({ error: true, message });
};

module.exports = {
  validateUserCredentials,
};
