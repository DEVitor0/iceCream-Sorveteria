const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionConfig = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.CONNECTION_STRING,
    ttl: 24 * 60 * 60 // 1 dia
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 86400000, // 24h
    path: '/' // Restringe o escopo
  }
});

module.exports = sessionConfig;
