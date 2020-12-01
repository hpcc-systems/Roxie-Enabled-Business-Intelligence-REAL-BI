const https = require('https');
const router = require('express').Router();
const axios = require('axios');
const jwtDecode = require('jwt-decode');

const { AUTH_APP_ID, AUTH_PORT, AUTH_URL, EXTERNAL_HTTPS_PORT, HOST_HOSTNAME, NODE_ENV } = process.env;

// Utils
const { createUser, getUserByEmail } = require('../../utils/user');
const {
  validate,
  validateLogin,
  validateRegistration,
  validateForgotPassword,
  validateResetPassword,
} = require('../../utils/validation');

// Create axios request instance
const instance = axios.create({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) });

router.post('/login', [validateLogin(), validate], async (req, res, next) => {
  let response, user;

  try {
    response = await instance.post(`${AUTH_URL}:${AUTH_PORT}/api/auth/login`, req.body);
  } catch (err) {
    res.status(err.response.status ? err.response.status : 500);
    const error = new Error(`${err.response.data ? err.response.data : 'Unknown error'}`);
    return next(error);
  }

  try {
    const token = response.data.accessToken;
    const { email, role, username } = jwtDecode(token);
    const hasPermission = role.some(({ User_Roles }) => User_Roles.applicationId == AUTH_APP_ID); // Used == instead of === because process.env converts all values to strings.

    if (!hasPermission) {
      res.status(401);
      throw new Error('User not authorized to use Real BI.');
    }

    user = await getUserByEmail(email);

    if (!user) {
      user = await createUser(email, username);
    }

    return res.json({ token, id: user.id, username });
  } catch (error) {
    return next(error);
  }
});

router.post('/register', [validateRegistration(), validate], async (req, res, next) => {
  let responseObj;

  try {
    const response = await instance.post(`${AUTH_URL}:${AUTH_PORT}/api/auth/registerUser`, {
      ...req.body,
      applicationId: AUTH_APP_ID,
      confirmpassword: req.body.confirmPassword,
      role: 'User',
    });

    // Auth Service will send a 201 if it creates a new user account or a 202 if it modifies an existing account
    if (response.status === 201) {
      responseObj = { message: 'User Account Created' };
    } else {
      responseObj = { message: 'User Account Modified' };
    }

    return res.status(response.status).json(responseObj);
  } catch (err) {
    res.status(err.response.status ? err.response.status : 500);
    const error = new Error(`${err.response.data ? err.response.data : 'Unknown error'}`);
    return next(error);
  }
});

router.post('/forgot_password', [validateForgotPassword(), validate], async (req, res, next) => {
  const resetUrl =
    NODE_ENV === 'production'
      ? `https://${HOST_HOSTNAME}/reset_password`
      : `https://${HOST_HOSTNAME}:${EXTERNAL_HTTPS_PORT}/reset_password`;

  try {
    const response = await instance.post(`${AUTH_URL}:${AUTH_PORT}/api/auth/forgotPassword`, {
      ...req.body,
      applicationId: AUTH_APP_ID,
      resetUrl,
    });

    return res.status(200).send(response.data);
  } catch (err) {
    res.status(err.response.status ? err.response.status : 500);
    const error = new Error(`${err.response.data ? err.response.data.message : 'Unknown error'}`);
    return next(error);
  }
});

router.post('/reset_password', [validateResetPassword(), validate], async (req, res, next) => {
  try {
    await instance.post(`${AUTH_URL}:${AUTH_PORT}/api/auth/resetPassword`, req.body);

    return res.status(200).json({ message: 'Password Reset Successfully' });
  } catch (err) {
    res.status(err.response.status ? err.response.status : 500);
    const error = new Error(`${err.response.data ? err.response.data : 'Unknown error'}`);
    return next(error);
  }
});

module.exports = router;