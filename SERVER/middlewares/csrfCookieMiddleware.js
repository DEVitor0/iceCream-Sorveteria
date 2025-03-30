module.exports = (req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
  });
  next();
};
