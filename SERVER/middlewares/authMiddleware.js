const { verifyToken } = require('../utils/auth');
const User = require('../model/userModel');

const authenticateJWT = (req, res, next) => {
  console.log('Iniciando autenticação JWT...');

  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

  console.log('Token recebido:', token ? 'Presente' : 'Ausente');

  if (!token) {
    console.log('Erro: Token não fornecido');
    return res.status(401).json({
      error: 'Acesso não autorizado',
      message: 'Token não fornecido'
    });
  }

  try {
    console.log('Verificando token...');
    const decoded = verifyToken(token);
    req.user = {
      _id: decoded.id,
      role: decoded.role
    };

    User.findByIdAndUpdate(decoded.id, { lastLogin: new Date() }, { new: true })
      .then(() => console.log('Último login atualizado'))
      .catch(err => console.error('Erro ao atualizar último login:', err));

    console.log('Token válido para usuário:', req.user);
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error.message);
    res.clearCookie('jwt');
    return res.status(401).json({
      error: 'Autenticação falhou',
      message: 'Token inválido ou expirado'
    });
  }
};

authenticateJWT.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('[BACK] Tentativa de acesso a rota protegida sem autenticação');
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Você precisa estar logado para acessar este recurso'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`[BACK] Acesso negado para ${req.user.role} em rota requerendo:`, roles);
      return res.status(403).json({
        error: 'Acesso proibido',
        message: 'Seu perfil não tem permissão para esta ação'
      });
    }

    next();
  };
};

module.exports = authenticateJWT;
