const csrf = require("csurf");

const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'strict',
  },
});

module.exports = csrfProtection;
