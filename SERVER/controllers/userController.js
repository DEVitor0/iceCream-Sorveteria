const User = require('../model/userModel');

const validateUserCredentials = async (req, res) => {
  try {
    const { username, password } = req.body; // ← Corrigir nome do campo

    if (!username || !password) {
      return res.status(400).json({
        error: true,
        message: 'Forneça usuário e senha'
      });
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'Usuário não encontrado'
      });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({
        error: true,
        message: 'Senha incorreta'
      });
    }

    res.status(200).json({
      valid: true,
      message: 'Credenciais válidas'
    });

  } catch (error) {
    console.error('Erro na validação:', error);
    res.status(500).json({
      error: true,
      message: 'Erro interno'
    });
  }
};

module.exports = { validateUserCredentials };
