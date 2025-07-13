const User = require('../../model/userModel');

const checkAdminOrModer = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Você precisa estar logado para acessar este recurso'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'O usuário associado a este token não foi encontrado'
      });
    }

    if (user.role !== 'admin' && user.role !== 'moder') {
      return res.status(403).json({
        error: 'Acesso proibido',
        message: 'Seu perfil não tem permissão para acessar o Dashboard'
      });
    }

    next();
  } catch (error) {
    console.error('Erro na verificação de autorização:', error);
    return res.status(500).json({
      error: 'Erro no servidor',
      message: 'Ocorreu um erro ao verificar as permissões'
    });
  }
};

module.exports = checkAdminOrModer;
