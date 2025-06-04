const csurf = require("csurf");

const csrfProtection = csurf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
  value: (req) => {
    if (!req.headers) return false;

    return req.headers['x-csrf-token'] ||
           req.headers['xsrf-token'] ||
           (req.body && req.body._csrf) ||
           (req.query && req.query._csrf);
  },
});

module.exports = csrfProtection;
