module.exports = {
  secret: process.env.JWT_SECRET || 'seu_segredo_super_secreto',
  expiresIn: '1d'
};
