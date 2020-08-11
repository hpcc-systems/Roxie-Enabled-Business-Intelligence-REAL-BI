const logger = require('../config/logger');

const errHandler = err => {
  const { response = {} } = err;
  const { data, message, status = 500, statusText } = response;

  // Get error message
  let errMsg = data || message || statusText || 'Internal Error';

  // Update error message if status is a 401
  if (status === 401) {
    errMsg = 'Incorrect Credentials Provided';
  }

  // Log error
  logger.error(errMsg);

  // Return error object
  return { errMsg, status };
};

module.exports = errHandler;
