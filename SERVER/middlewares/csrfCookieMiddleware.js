module.exports = (req, res, next) => {
  if (!req.csrfToken) {
    return next(new Error('CSRF token não disponível'));
  }

  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  next();
};
