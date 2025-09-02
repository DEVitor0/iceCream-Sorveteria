const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: 'Muitas requisições feitas, tente novamente mais tarde.',
  headers: true,
});

module.exports = {limiter};
