/**
 * Created by nisheeth on 22/7/16.
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logsDir = path.join(__dirname, '../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

winston.loggers.add('server', {
  console: {
    label: 'server'
  },
  file: {
    filename: path.join(logsDir, 'server.log')
  }
});

const morgan = require('morgan')('combined', {
  stream: {
    write: (message, encoding) => {
      // Write server log from express and trim the trailing new line
      winston.loggers.get('server').info(message.slice(0, -1));
    }
}});

module.exports = (name) => {
  if (name === 'morgan') {
    return morgan;
  }
  return winston.loggers.get(name);
};