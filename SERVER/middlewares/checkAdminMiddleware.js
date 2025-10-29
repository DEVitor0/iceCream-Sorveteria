const ApiError = require('../utils/ApiError');

module.exports = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'moder') {
    return next(new ApiError(403, 'Acesso negado - somente administradores'));
  }
  next();
};
