// eslint-disable-next-line import/no-anonymous-default-export
export default {
  secret: process.env.JWT_SECRET || 'seu_segredo_super_secreto',
  expiresIn: '1d'
};
