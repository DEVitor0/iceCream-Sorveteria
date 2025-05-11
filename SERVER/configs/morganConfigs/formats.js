const morgan = require('morgan');
const colors = require('colors');

// Definindo tokens personalizados com formatação
morgan.token('body', (req) => {
  if (!req.body) return colors.gray('{}');

  const body = {...req.body};
  if (body.password) body.password = '******';
  return colors.gray(JSON.stringify(body, null, 2));
});

morgan.token('headers', (req) =>
  colors.gray(JSON.stringify(req.headers, null, 2))
);

morgan.token('query', (req) =>
  colors.gray(JSON.stringify(req.query, null, 2))
);

morgan.token('params', (req) =>
  colors.gray(JSON.stringify(req.params, null, 2))
);

morgan.token('cookies', (req) =>
  colors.gray(JSON.stringify(req.cookies, null, 2))
);

morgan.token('user-agent', (req) =>
  colors.blue(req.headers['user-agent'])
);

morgan.token('ip', (req) =>
  colors.blue(req.ip || req.connection.remoteAddress)
);

morgan.token('date-colored', () =>
  colors.gray(new Date().toISOString())
);

morgan.token('method-colored', (req) => {
  const method = req.method;
  const color =
    method === 'GET' ? 'green' :
    method === 'POST' ? 'yellow' :
    method === 'PUT' ? 'blue' :
    method === 'DELETE' ? 'red' : 'white';
  return colors[color](method);
});

morgan.token('url-colored', (req) =>
  colors.cyan(req.url)
);

morgan.token('status-colored', (req, res) => {
  const status = res.statusCode;
  const color =
    status >= 500 ? 'red' :
    status >= 400 ? 'yellow' :
    status >= 300 ? 'cyan' :
    status >= 200 ? 'green' : 'white';
  return colors[color](status);
});

// Formatos melhorados
const formats = {
  combined: [
    colors.yellow('----------------------------------------'),
    `${colors.bold('Request:')} :date-colored :method-colored :url-colored :status-colored :res[content-length] - :response-time ms`,
    `${colors.bold('IP:')} :ip`,
    `${colors.bold('User Agent:')} :user-agent`,
    '',
    `${colors.bold.yellow('Headers:')}`,
    ':headers',
    '',
    `${colors.bold.yellow('Query:')}`,
    ':query',
    '',
    `${colors.bold.yellow('Params:')}`,
    ':params',
    '',
    `${colors.bold.yellow('Body:')}`,
    ':body',
    '',
    `${colors.bold.yellow('Cookies:')}`,
    ':cookies',
    colors.yellow('----------------------------------------')
  ].join('\n'),

  dev: [
    '[:date-colored]',
    ':method-colored',
    ':url-colored',
    ':status-colored',
    ':response-time ms -',
    ':res[content-length]'
  ].join(' '),

  minimal: [
    ':method-colored',
    ':url-colored',
    ':status-colored',
    ':res[content-length] -',
    ':response-time ms'
  ].join(' '),

  error: [
    colors.yellow('----------------------------------------'),
    `${colors.bold.red('ERROR:')} :date-colored :method-colored :url-colored :status-colored - :response-time ms`,
    `${colors.bold('Error:')} :error`,
    `${colors.bold('Stack:')} :stack`,
    colors.yellow('----------------------------------------')
  ].join('\n')
};

// Tokens para erros
morgan.token('error', (req, res) =>
  res.locals.error ? colors.red(res.locals.error.message || res.locals.error) : ''
);

morgan.token('stack', (req, res) =>
  res.locals.errorStack ? colors.gray(res.locals.errorStack) : ''
);

module.exports = {
  formats,
  morganTokens: morgan
};
