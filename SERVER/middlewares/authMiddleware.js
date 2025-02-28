const { verifyToken } = require('../utils/auth');

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.clearCookie('jwt');
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authenticateJWT;
