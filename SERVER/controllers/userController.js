const User = require('../model/userModel');

const validateUserCredentials = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new Error('Usuário não encontrado');

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) throw new Error('Senha incorreta');

  return user;
};

module.exports = {
  validateUserCredentials,
};
