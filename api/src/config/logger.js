const path = require('path');
const { createLogger, format, transports } = require('winston');
const { colorize, combine, json, printf, timestamp } = format;

// Log directory path
const logPath = filename => path.join(process.cwd(), 'logs', filename);

// Timestamp format for logs
const timeStampFormat = 'MM-DD-YYYY HH:mm:ss';

// Console Log Entry Format
const consoleFormat = printf(({ level, message, timestamp }) => {
  if (typeof message === 'object') {
    message = JSON.stringify(message);
  }

  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    new transports.File({
      filename: logPath('error.log'),
      format: combine(timestamp({ format: timeStampFormat }), json()),
      level: 'error',
    }),
    // - Write all logs with level `info` and below to `combined.log`
    new transports.File({
      filename: logPath('combined.log'),
      format: combine(timestamp({ format: timeStampFormat }), json()),
    }),
    new transports.Console({
      format: combine(timestamp({ format: timeStampFormat }), colorize(), consoleFormat),
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
