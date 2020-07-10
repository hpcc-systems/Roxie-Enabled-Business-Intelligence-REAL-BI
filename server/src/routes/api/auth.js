const router = require('express').Router();
const axios = require('axios');
const jwtDecode = require('jwt-decode');
const logger = require('../../config/logger');
const errHandler = require('../../utils/errHandler');

const { AUTH_APP_ID, AUTH_PORT, AUTH_URL } = process.env;

// Utils
const { getUserByID } = require('../../utils/auth');
const { createUser } = require('../../utils/user');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let response, user;

  // Create auth service url
  const url = `${AUTH_URL}:${AUTH_PORT}/auth/login`;

  try {
    response = await axios.post(url, { username, password });
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  // Decode and destructure jwt token
  const token = response.data.accessToken;
  const { id, role, username: tokenUsername } = jwtDecode(token);
  const hasPermission = role.some(({ ApplicationId }) => ApplicationId == AUTH_APP_ID); // Used == instead of === because process.env converts all values to strings.

  // User doesn't have permission to use this app
  if (!hasPermission) {
    logger.error('User not authorized to use Real BI.');
    return res.status(401).send('Unauthorized Request');
  }

  // Is user already in DB
  try {
    user = await getUserByID(id);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  // No user found, add to DB
  if (!user) {
    await createUser(id);
    user = { directory: [], directoryDepth: [], lastDashboard: null };
  }

  res.status(200).json({ id, token, username: tokenUsername, ...user });
});

module.exports = router;
