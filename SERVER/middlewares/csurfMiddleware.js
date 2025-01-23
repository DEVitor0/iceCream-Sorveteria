const csurf = require('csurf');

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  }
});

const exposeCsrfToken = (req, res, next) => {
  res.cookie('csrf-token', req.csrfToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  next();
};

module.exports = { csrfProtection, exposeCsrfToken };
