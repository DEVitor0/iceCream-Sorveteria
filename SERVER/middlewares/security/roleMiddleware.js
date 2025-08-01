const ApiError = require('../../utils/ApiError');

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return next(new ApiError(403, 'Acesso negado. Permissão insuficiente'));
    }
    next();
  };
};

module.exports = checkRole;
