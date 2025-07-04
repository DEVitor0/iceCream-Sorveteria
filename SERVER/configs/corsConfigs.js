const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://allowing-llama-seemingly.ngrok-free.app',
  'https://allowing-llama-seemingly.ngrok-free.app:3000',
  'https://allowing-llama-seemingly.ngrok-free.app:8080'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.endsWith('.ngrok-free.app') ||
      origin.endsWith('.ngrok.io')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
