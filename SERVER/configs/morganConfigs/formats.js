const morgan = require('morgan');
const colors = require('colors');

// Configuração de cores
colors.setTheme({
  info: 'cyan',
  success: 'green',
  warning: 'yellow',
  error: 'red',
  debug: 'blue',
  timestamp: 'gray',
  highlight: 'rainbow',
  section: ['underline', 'bold']
});

// Tokens personalizados com formatação melhorada
morgan.token('custom-date', () => {
  return colors.timestamp(new Date().toISOString());
});

morgan.token('custom-method', (req) => {
  const method = req.method;
  const colorMap = {
    'GET': 'success',
    'POST': 'warning',
    'PUT': 'info',
    'DELETE': 'error',
    'PATCH': 'debug'
  };
  return colors[colorMap[method] || 'white'](method.padEnd(7));
});

morgan.token('custom-status', (req, res) => {
  const status = res.statusCode;
  const color =
    status >= 500 ? 'error' :
    status >= 400 ? 'warning' :
    status >= 300 ? 'info' :
    status >= 200 ? 'success' : 'white';
  return colors[color](status.toString().padStart(3));
});

morgan.token('custom-url', (req) => {
  return colors.cyan(req.url);
});

morgan.token('custom-response-time', (req, res) => {
  const time = parseFloat(req._responseTime || 0);
  let color = 'green';
  if (time > 1000) color = 'error';
  else if (time > 500) color = 'warning';
  else if (time > 200) color = 'yellow';
  return colors[color](time.toFixed(2) + ' ms');
});

morgan.token('divider', () => {
  return colors.gray('---------------------------------------');
});

morgan.token('section-title', (req, res, section) => {
  return colors.section(`=== ${section.toUpperCase()} ===`);
});

// Formatos personalizados
const formats = {
  detailed: [
    '[0] :divider',
    '[0] :section-title:início da requisição',
    '[0] Ambiente: :env',
    '[0] :divider',
    '[0] Método: :custom-method',
    '[0] URL: :custom-url',
    '[0] Status: :custom-status',
    '[0] Tempo: :custom-response-time',
    '[0] IP: :ip',
    '[0] User Agent: :user-agent',
    '[0] :divider',
    '[0] Headers:',
    ':headers',
    '[0] ',
    '[0] Query:',
    ':query',
    '[0] ',
    '[0] Params:',
    ':params',
    '[0] ',
    '[0] Body:',
    ':body',
    '[0] ',
    '[0] Cookies:',
    ':cookies',
    '[0] :divider'
  ].join('\n'),

  // Adicione outros formatos conforme necessário
};

// Tokens adicionais
morgan.token('env', () => process.env.NODE_ENV || 'development');
morgan.token('ip', (req) => colors.info(req.ip || req.connection.remoteAddress));
morgan.token('user-agent', (req) => colors.debug(req.headers['user-agent']));

// Configuração para objetos (headers, query, etc.)
const formatObject = (obj) => {
  if (!obj || Object.keys(obj).length === 0) return colors.gray('{}');
  return colors.white(JSON.stringify(obj, null, 2)
    .split('\n')
    .map(line => `[0] ${line}`)
    .join('\n'));
};

morgan.token('headers', (req) => formatObject(req.headers));
morgan.token('query', (req) => formatObject(req.query));
morgan.token('params', (req) => formatObject(req.params));
morgan.token('body', (req) => {
  if (!req.body || Object.keys(req.body).length === 0) return colors.gray('{}');

  const body = {...req.body};
  // Esconde informações sensíveis
  if (body.password) body.password = '******';
  if (body.token) body.token = '******';
  if (body.jwt) body.jwt = '******';

  return formatObject(body);
});

morgan.token('cookies', (req) => {
  if (!req.cookies || Object.keys(req.cookies).length === 0) return colors.gray('{}');

  const cookies = {...req.cookies};
  // Esconde informações sensíveis
  if (cookies.jwt) cookies.jwt = '******';
  if (cookies.token) cookies.token = '******';

  return formatObject(cookies);
});

module.exports = {
  formats,
  morganTokens: morgan
};
