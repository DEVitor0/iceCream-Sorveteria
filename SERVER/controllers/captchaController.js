const crypto = require('crypto');

exports.generateCaptchaSecret = () => {
  const text = crypto.randomBytes(8).toString('hex').slice(0, 6).toUpperCase();
  const secret = crypto.randomBytes(8).toString('hex');
  return { text, secret };
};
