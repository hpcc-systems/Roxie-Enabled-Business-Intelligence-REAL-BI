const router = require('express').Router();
const axios = require('axios');
const jwtDecode = require('jwt-decode');

const {
  AUTH_CLIENT_ID,
  AUTH_PORT,
  AUTH_URL,
  EXTERNAL_HTTPS_PORT,
  HOST_HOSTNAME,
  NODE_ENV,
  CREATE_DEMO_WORKSPACE,
} = process.env;

// Utils
const { createUser, getUserByEmail } = require('../../utils/user');
const {
  validate,
  validateLogin,
  validateRegistration,
  validateForgotPassword,
  validateResetPassword,
} = require('../../utils/validation');
const { addSharedResourcesToUser } = require('../../utils/share');
const { createDemoWorkspace } = require('../../utils/createDemoWorkspace');

// Axios config

router.post('/login', [validateLogin(), validate], async (req, res, next) => {
  let response, user;

  try {
    const requestBody = { ...req.body, clientId: AUTH_CLIENT_ID };

    response = await axios.post(`${AUTH_URL}:${AUTH_PORT}/api/auth/login`, requestBody);
  } catch (err) {
    res.status(err?.response?.status || 500);
    const error = new Error(`${err?.response?.data || 'Unknown error'}`);
    return next(error);
  }

  try {
    const token = response.data.accessToken;
    const { email, username } = jwtDecode(token);

    user = await getUserByEmail(email);

    if (!user) {
      user = await createUser(email, username);
      if (CREATE_DEMO_WORKSPACE) {
        const defaultWorkspaceId = await createDemoWorkspace(user);
        if (defaultWorkspaceId) {
          user.lastViewedWorkspace = defaultWorkspaceId;
          await user.save();
        }
      }
    }

    return res.json({ token, id: user.id, username, lastViewedWorkspace: user.lastViewedWorkspace });
  } catch (error) {
    return next(error);
  }
});

router.post('/register', [validateRegistration(), validate], async (req, res, next) => {
  let responseStatus;
  let responseObj;

  try {
    const requestUrl = `${AUTH_URL}:${AUTH_PORT}/api/auth/registerUser`;
    const requestBody = {
      ...req.body,
      clientId: AUTH_CLIENT_ID,
      confirmpassword: req.body.confirmPassword,
      role: 'User',
    };
    const response = await axios.post(requestUrl, requestBody);

    // Auth Service will send a 201 if it creates a new user account or a 202 if it modifies an existing account
    responseStatus = response.status;
    if (responseStatus === 201) {
      responseObj = { message: 'User Account Created' };
    } else {
      responseObj = { message: 'User Account Modified' };
    }
  } catch (err) {
    res.status(err?.response?.status || 500);
    const error = new Error(`${err?.response?.data?.error || err?.response?.data || 'Unknown error'}`);
    return next(error);
  }

  try {
    const { email, shareID, username } = req.body;

    if (shareID) {
      await addSharedResourcesToUser(email, username, shareID);
    }

    return res.status(responseStatus).json(responseObj);
  } catch (error) {
    return next(error);
  }
});

router.post('/forgot_password', [validateForgotPassword(), validate], async (req, res, next) => {
  const resetUrl =
    NODE_ENV === 'production'
      ? `https://${HOST_HOSTNAME}/reset_password`
      : `https://${HOST_HOSTNAME}:${EXTERNAL_HTTPS_PORT}/reset_password`;

  try {
    const requestUrl = `${AUTH_URL}:${AUTH_PORT}/api/auth/forgotPassword`;
    const requestBody = { ...req.body, clientId: AUTH_CLIENT_ID, resetUrl };
    const response = await axios.post(requestUrl, requestBody);

    return res.status(200).send(response.data);
  } catch (err) {
    res.status(err?.response?.status || 500);
    const error = new Error(`${err?.response?.data?.message || 'Unknown error'}`);
    return next(error);
  }
});

router.post('/reset_password', [validateResetPassword(), validate], async (req, res, next) => {
  try {
    await axios.post(`${AUTH_URL}:${AUTH_PORT}/api/auth/resetPassword`, req.body);

    return res.status(200).json({ message: 'Password Reset Successfully' });
  } catch (err) {
    res.status(err?.response?.status || 500);
    const error = new Error(`${err?.response?.data || 'Unknown error'}`);
    return next(error);
  }
});

module.exports = router;
