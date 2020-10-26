const https = require('https');
const axios = require('axios');
const logger = require('../config/logger');
const errHandler = require('../utils/errHandler');

// Constants
const { AUTH_APP_ID, AUTH_PORT, AUTH_URL } = process.env;

const authenticateToken = () => {
  return async (req, res, next) => {
    let token = req.headers.authorization;
    let response;

    // No token provided
    if (!token) {
      logger.error('No token provided in request header.');
      return res.status(401).send('Auth Token Required');
    }

    // Create auth service request instance
    const requestInstance = axios.create({
      url: `${AUTH_URL}:${AUTH_PORT}/api/auth/verify`,
      method: 'POST',
      headers: { authorization: token },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // WARNING: This disables client verification
    });

    try {
      response = await requestInstance();
    } catch (err) {
      const { errMsg, status } = errHandler(err);
      return res.status(status).send(errMsg);
    }

    // Destructure response to get user data
    const { id, role, username: tokenUsername } = response.data.verified;
    const hasPermission = role.some(({ User_Roles }) => User_Roles.applicationId == AUTH_APP_ID); // Used == instead of === for flexibility and type coercion.

    // User doesn't have permission to use this app
    if (!hasPermission) {
      logger.error('User not authorized to use Real BI.');
      return res.status(401).send('Unauthorized Request');
    }

    // Update request object
    req.user = { id, username: tokenUsername };

    // Move to next method
    next();
  };
};

const logRequest = () => {
  return async (req, res, next) => {
    const { baseUrl, method, url } = req;

    // Log request
    logger.info(`${method} request made to ${baseUrl}${url}`);

    // Move to next method
    next();
  };
};

module.exports = { authenticateToken, logRequest };
