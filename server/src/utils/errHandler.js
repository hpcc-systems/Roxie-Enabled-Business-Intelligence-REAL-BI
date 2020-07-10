const logger = require('../config/logger');

const errHandler = err => {
  const { response: { status = 500 } = { status: 500 }, message = 'Internal Error' } = err;
  let errMsg = message;

  if (status === 401) {
    errMsg = 'Incorrect Credentials Provided';
  }

  logger.error(errMsg);

  return { errMsg, status };
};

module.exports = errHandler;
