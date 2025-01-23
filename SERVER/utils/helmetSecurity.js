const helmet = require('helmet');

const applySecurityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https:'],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
});

module.exports = {
  applySecurityHeaders,
};
