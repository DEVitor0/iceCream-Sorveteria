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

module.exports = authenticateJWT; const mongoose = require('mongoose');

const TwoFACodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Code expires after 10 minutes (600 seconds)
    }
});

module.exports = mongoose.model('TwoFACode', TwoFACodeSchema);
