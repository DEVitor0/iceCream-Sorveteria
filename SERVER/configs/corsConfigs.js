const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'CSRF-Token',
    'X-Requested-With',
    'Accept'
  ],
  optionsSuccessStatus: 200,
  exposedHeaders: ['CSRF-Token', 'set-cookie'],
  maxAge: 3600
};

module.exports = corsOptions;
