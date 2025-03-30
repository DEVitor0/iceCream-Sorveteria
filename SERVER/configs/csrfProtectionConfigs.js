const csurf = require("csurf");

const csrfProtection = csurf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
  value: (req) => {
    return req.headers['x-csrf-token'];
  },
});
module.exports = csrfProtection;
