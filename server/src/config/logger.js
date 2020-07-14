const path = require('path');
const { createLogger, format, transports } = require('winston');
const { colorize, combine, printf, timestamp } = format;

// Log directory path
const logPath = filename => path.join(process.cwd(), 'logs', filename);

// Timestamp format for logs
const timeStampFormat = 'MM-DD-YYYY HH:mm:ss';

// Log Entry Format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    new transports.File({
      filename: logPath('error.log'),
      format: combine(timestamp({ format: timeStampFormat }), logFormat),
      level: 'error',
    }),
    // - Write all logs with level `info` and below to `combined.log`
    new transports.File({
      filename: logPath('combined.log'),
      format: combine(timestamp({ format: timeStampFormat }), logFormat),
    }),
  ],
  exitOnError: false,
});

// If not in production environment, print logs to the `console`
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(timestamp({ format: timeStampFormat }), colorize(), logFormat),
    }),
  );
}

module.exports = logger;
