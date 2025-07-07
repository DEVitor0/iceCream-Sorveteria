module.exports = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  rateLimit: {
    maxEmailsPerMinute: 100,
    delayBetweenBatches: 60000
  },
  defaultFrom: 'no-reply@seusite.com'
};
