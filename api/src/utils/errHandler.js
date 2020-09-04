const logger = require('../config/logger');

const errHandler = err => {
  const { errors = [{ message: null }], response = {} } = err;
  const { message: sequelizeMsg = null } = errors[0];
  const { data, message, status = 500, statusText } = response;

  // Get error message
  let errMsg = sequelizeMsg || data || message || statusText || 'Internal Error';

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
