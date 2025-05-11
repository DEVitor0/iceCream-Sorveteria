// configs/morganConfigs.js
const morgan = require('morgan');
const { formats } = require('./formats');
const setupLogStream = require('./stream');

const configureMorgan = (app, appRoot) => {
  const { createStream, logsPath } = setupLogStream(appRoot);

  // Configuração para desenvolvimento - mostra TUDO no console
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan(formats.combined, {
      skip: (req) => {
        // Não pular nenhuma requisição
        return false;
      }
    }));
  }

  // Configuração para arquivo de log
  app.use(morgan(formats.combined, {
    stream: createStream(),
    skip: (req) => req.url === '/health'
  }));

  return { logsPath };
};

module.exports = configureMorgan;
