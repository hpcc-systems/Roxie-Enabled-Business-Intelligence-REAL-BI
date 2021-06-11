const https = require('https');
const axios = require('axios');
const logger = require('../config/logger');
const passport = require('passport');
const { getUserByUsername } = require('../utils/user');

// Constants
const { AUTH_CLIENT_ID, AUTH_PORT, AUTH_URL, NODE_ENV, REACT_APP_AUTH_METHOD } = process.env;

const authenticateToken = async (req, res, next) => {
  // Azure login flow if ADFS is in ENV
  if (REACT_APP_AUTH_METHOD === 'ADFS') {
    passport.authenticate('oauth-bearer', {
      session: false,
    })(req, res, next);
  } else {
    let token = req.headers.authorization;
    let response;

    try {
      if (!token) {
        res.status(401);
        throw new Error('Auth Token Required');
      }
      const requestUrl = `${AUTH_URL}:${AUTH_PORT}/api/auth/verify`;
      const requestBody = { clientId: AUTH_CLIENT_ID };
      response = await axios.post(requestUrl, requestBody, {
        headers: { authorization: token },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      });
    } catch (err) {
      res.status(err?.response?.status || 500);
      const error = new Error(`${err?.response?.data || 'Unknown error'}`);
      return next(error);
    }

    try {
      // Get username from response
      const { username } = response.data.verified;
      const { id } = await getUserByUsername(username);

      // Add user object to request
      req.user = { id, username };

      return next();
    } catch (error) {
      return next(error);
    }
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
