const https = require('https');
const axios = require('axios');
const logger = require('../config/logger');
const { getUserByUsername } = require('../utils/user');

// Constants
const { AUTH_APP_ID, AUTH_PORT, AUTH_URL, NODE_ENV } = process.env;

const authenticateToken = async (req, res, next) => {
  let token = req.headers.authorization;
  let response;

  try {
    if (!token) {
      res.status(401);
      throw new Error('Auth Token Required');
    }

    // Create axios request instance
    const requestInstance = axios.create({
      url: `${AUTH_URL}:${AUTH_PORT}/api/auth/verify`,
      method: 'POST',
      headers: { authorization: token },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    response = await requestInstance();
  } catch (err) {
    res.status(err.response.status ? err.response.status : 500);
    const error = new Error(`${err.response.data ? err.response.data : 'Unknown error'}`);
    return next(error);
  }

  try {
    // Get user data from response
    const { role, username } = response.data.verified;
    const hasPermission = role.some(({ User_Roles }) => User_Roles.applicationId == AUTH_APP_ID); // Used == instead of === for flexibility and type coercion.

    if (!hasPermission) {
      res.status(401);
      throw new Error('User not authorized to use Real BI.');
    }

    const { id } = await getUserByUsername(username);

    // Add user object to request
    req.user = { id, username };

    return next();
  } catch (error) {
    return next(error);
  }
};

const logRequest = (req, res, next) => {
  const { baseUrl, method, url } = req;
  logger.info(`${method} request made to ${baseUrl}${url}`);
  next();
};

const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Endpoint Not Found - ${req.originalUrl}`);
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  logger.error(error.stack);

  res.status(statusCode).json({
    message: error.message,
    stack: NODE_ENV === 'production' ? '🥞' : error.stack,
  });
};

module.exports = { authenticateToken, logRequest, notFound, errorHandler };
