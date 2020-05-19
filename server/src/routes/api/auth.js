const router = require('express').Router();
const axios = require('axios');
const jwtDecode = require('jwt-decode');

const { AUTH_APP_ID, AUTH_PORT, AUTH_URL } = process.env;

// Utils
const { getUserByID } = require('../../utils/auth');
const { createUserSettings } = require('../../utils/userSettings');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let response, user;

  // Create auth service url
  const url = `${AUTH_URL}:${AUTH_PORT}/auth/login`;

  try {
    response = await axios.post(url, { username, password });
  } catch (err) {
    const { data = 'Unknown Error', status } = err.response;
    return res.status(status).send(data);
  }

  // Decode and destructure jwt token
  const token = response.data.accessToken;
  const { id, role, username: tokenUsername } = jwtDecode(token);
  const hasPermission = role.some(({ ApplicationId }) => ApplicationId == AUTH_APP_ID); // Used == instead of === because process.env converts all values to strings.

  // User doesn't have permission to use this app
  if (!hasPermission) {
    return res.status(401).send('User not authorized for this app');
  }

  // Is user already in DB
  try {
    user = await getUserByID(id);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }

  // No user found, add to DB
  if (!user) {
    await createUserSettings(id);
    user = { directory: [], directoryDepth: [], lastDashboard: null };
  }

  res.status(200).json({ id, token, username: tokenUsername, ...user });
});

module.exports = router;
