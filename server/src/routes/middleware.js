const axios = require('axios');

const { AUTH_APP_ID, AUTH_PORT, AUTH_URL } = process.env;

// Utils
const { getUserByID } = require('../utils/auth');

const authenticateToken = () => {
  return async (req, res, next) => {
    let token = req.headers.authorization;
    let response, user;

    // Create auth service url
    const url = `${AUTH_URL}:${AUTH_PORT}/auth/verify`;

    // Create auth service request instance
    const requestInstance = axios.create({ url, headers: { authorization: token } });

    try {
      response = await requestInstance.post();
    } catch (err) {
      const { data = 'Unknown Error', status } = err.response;
      return res.status(status).send(data);
    }

    const { id, role } = response.data.verified;
    const hasPermission = role.some(({ ApplicationId }) => ApplicationId == AUTH_APP_ID); // Used == instead of === because process.env converts all values to strings.

    // User doesn't have permission to use this app
    if (!hasPermission) {
      return res.status(401).send('User not authorized for this app');
    }

    // Get user details
    try {
      user = await getUserByID(id);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    // Update request object
    req.user = { ...user };

    // Move to next method
    next();
  };
};

module.exports = { authenticateToken };
