const { verifyToken } = require('../utils/auth');

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Acesso não autorizado',
      message: 'Token não fornecido'
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch (error) {
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