const axios = require('axios');

// Constants
const { AUTH_APP_ID, AUTH_PORT, AUTH_URL } = process.env;

// Utils
const { getUserByID } = require('../utils/auth');

const authenticateToken = () => {
  return async (req, res, next) => {
    let token = req.headers.authorization;
    let response, user;

    // No token provided
    if (!token) {
      return res.status(401).send('Auth Token Required');
    }

    // Create auth service request instance
    const requestInstance = axios.create({
      url: `${AUTH_URL}:${AUTH_PORT}/auth/verify`,
      method: 'POST',
      headers: { authorization: token },
    });

    try {
      response = await requestInstance();
    } catch (err) {
      const { data = 'Unknown Error', status } = err.response;
      return res.status(status).send(data);
    }

    // Destructure response to get user data
    const { id, role } = response.data.verified;
    const hasPermission = role.some(({ ApplicationId }) => ApplicationId == AUTH_APP_ID); // Used == instead of === for flexibility and type coercion.

    // User doesn't have permission to use this app
    if (!hasPermission) {
      return res.status(401).send('Unauthorized Request');
    }

    // Get user details
    try {
      user = await getUserByID(id);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    // Update request object
    req.user = {
      ...user,
      role: role.filter(({ ApplicationId }) => ApplicationId == AUTH_APP_ID), // Used == instead of === for flexibility and type coercion.
    };

    // Move to next method
    next();
  };
};

module.exports = { authenticateToken };
