const fs = require('fs');
const path = require('path');

const setupLogStream = (appRoot) => {
  const logsDir = path.join(appRoot, 'logs');
  const serverLogsDir = path.join(logsDir, 'server');

  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
  if (!fs.existsSync(serverLogsDir)) fs.mkdirSync(serverLogsDir);

  return {
    createStream: () => {
      const currentDate = new Date().toISOString().split('T')[0];
      return fs.createWriteStream(
        path.join(serverLogsDir, `access_${currentDate}.log`),
        { flags: 'a' }
      );
    },
    logsPath: serverLogsDir
  };
};

module.exports = setupLogStream;
