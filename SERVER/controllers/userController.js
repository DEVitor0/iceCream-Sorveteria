const User = require('../model/userModel');

const validateUserCredentials = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Forneça email e senha'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Credenciais válidas'
    });

  } catch (error) {
    console.error('Erro na validação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

module.exports = { validateUserCredentials };