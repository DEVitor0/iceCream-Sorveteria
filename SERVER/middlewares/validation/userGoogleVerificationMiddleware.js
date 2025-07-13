const User = require('../../model/userModel');

const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    req.authenticatedUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      photo: user.photo,
      role: user.role,
      provider: user.provider,
      googleSub: user.googleSub
    };

    next();
  } catch (error) {
    console.error('Erro na verificação do usuário:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno na verificação do usuário'
    });
  }
};

module.exports = verifyUser;
