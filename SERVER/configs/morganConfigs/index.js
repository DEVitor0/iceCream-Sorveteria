const morgan = require('morgan');
const { formats } = require('./formats');
const setupLogStream = require('./stream');

const configureMorgan = (app, appRoot) => {
  const { createStream, logsPath } = setupLogStream(appRoot);

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan(formats.combined, {
      skip: (req) => {
        return false;
      }
    }));
  }

  app.use(morgan(formats.combined, {
    stream: createStream(),
    skip: (req) => req.url === '/health'
  }));

  return { logsPath };
};

module.exports = configureMorgan;
