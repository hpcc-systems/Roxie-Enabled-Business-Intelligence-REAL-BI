const router = require('express').Router();
const axios = require('axios');
const jwtDecode = require('jwt-decode');
const logger = require('../../config/logger');
const errHandler = require('../../utils/errHandler');

const { AUTH_APP_ID, AUTH_PORT, AUTH_URL, EXTERNAL_HTTP_PORT, HOST_HOSTNAME, NODE_ENV } = process.env;

// Utils
const { getUserByID } = require('../../utils/auth');
const { createUser } = require('../../utils/user');
const { getWorkspaces } = require('../../utils/workspace');
const {
  validate,
  validateLogin,
  validateRegistration,
  validateForgotPassword,
  validateResetPassword,
} = require('../../utils/validation');

router.post('/login', [validateLogin(), validate], async (req, res) => {
  const { username, password } = req.body;
  let response, user, workspaces;

  // Log attempt
  logger.info(`User ${username} attempted to login.`);

  // Create auth service url
  const url = `${AUTH_URL}:${AUTH_PORT}/auth/login`;

  try {
    response = await axios.post(url, { username, password });
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    if (typeof errMsg !== 'object') {
      return res.status(status).send({ errors: [{ msg: errMsg }] });
    }

    return res.status(status).send(errMsg);
  }

  // Decode and destructure jwt token
  const token = response.data.accessToken;
  const { id, role, username: tokenUsername } = jwtDecode(token);
  const hasPermission = role.some(({ ApplicationId }) => ApplicationId == AUTH_APP_ID); // Used == instead of === because process.env converts all values to strings.

  // User doesn't have permission to use this app
  if (!hasPermission) {
    logger.error('User not authorized to use Real BI.');
    return res.status(401).send({ errors: [{ msg: 'Unauthorized Request' }] });
  }

  // Is user already in DB
  try {
    user = await getUserByID(id);

    // No user found, add to DB
    if (!user) {
      await createUser(id);
      user = { lastWorkspace: null };
    } else {
      workspaces = await getWorkspaces(id);
    }
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  res.status(200).json({ id, token, username: tokenUsername, ...user, workspaces });
});

router.post('/register', [validateRegistration(), validate], async (req, res) => {
  const { confirmPassword, email, firstName, lastName, password, username } = req.body;
  let response;

  // Create axios request objects
  const reqURL = `${AUTH_URL}:${AUTH_PORT}/auth/registerUser`;
  const reqBody = {
    applicationId: AUTH_APP_ID,
    confirmpassword: confirmPassword,
    email,
    firstName,
    lastName,
    role: 'User',
    password,
    username,
  };

  // Log API request
  logger.info(
    `Request made to ${reqURL} with body '${JSON.stringify({
      ...reqBody,
      confirmpassword: '--REDACTED--',
      email: '--REDACTED--',
      password: '--REDACTED--',
      username: '--REDACTED--',
    })}'`,
  );

  try {
    response = await axios.post(reqURL, reqBody);
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    return res.status(status).send(errMsg);
  }

  // Auth Service will send a 201 if it creates a new user account or a 202 if it modifies an existing account to grant permission to Real BI
  // Handle notification to user on the client side
  res.status(response.status).end();
});

router.post('/forgot-password', [validateForgotPassword(), validate], async (req, res) => {
  const { username } = req.body;
  const resetUrl =
    NODE_ENV === 'production'
      ? `https://${HOST_HOSTNAME}/reset-password`
      : `http://${HOST_HOSTNAME}:${EXTERNAL_HTTP_PORT}/reset-password`;
  let response;

  // Create axios request objects
  const reqURL = `${AUTH_URL}:${AUTH_PORT}/auth/forgotPassword`;
  const reqBody = {
    applicationId: AUTH_APP_ID,
    username,
    resetUrl,
  };

  // Log API request
  logger.info(`Request made to ${reqURL} with body '${JSON.stringify(reqBody)}'`);

  try {
    response = await axios.post(reqURL, reqBody);
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    return res.status(status).send(errMsg);
  }

  res.status(200).send(response.data);
});

router.post('/reset-password', [validateResetPassword(), validate], async (req, res) => {
  const { id, password } = req.body;

  // Create axios request objects
  const reqURL = `${AUTH_URL}:${AUTH_PORT}/auth/resetPassword`;
  const reqBody = { id, password };

  // Log API request
  logger.info(
    `Request made to ${reqURL} with body '${JSON.stringify({ ...reqBody, password: '--REDACTED--' })}'`,
  );

  try {
    await axios.post(reqURL, reqBody);
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    return res.status(status).send(errMsg);
  }

  res.status(202).end();
});

module.exports = router;
