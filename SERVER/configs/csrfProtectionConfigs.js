const csrf = require("csurf");

const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'strict',
  },
  value: (req) => {
    console.log('[CSRF] Received token:', req.headers['x-csrf-token']);
    return req.headers['x-csrf-token'];
  }
});

module.exports = csrfProtection;
