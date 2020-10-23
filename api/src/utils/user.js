const axios = require('axios');
const { user: userModel } = require('../models');

const { AUTH_PORT, AUTH_URL, SHARE_USERNAME, SHARE_PASSWORD } = process.env;

//Utils
const { awaitHandler } = require('./misc');

const createUser = async userID => {
  await userModel.create({ id: userID });

  return;
};

const getSuperUserToken = async () => {
  const url = `${AUTH_URL}:${AUTH_PORT}/api/auth/login`;

  let [err, response] = await awaitHandler(
    axios.post(url, { username: SHARE_USERNAME, password: SHARE_PASSWORD }),
  );

  // Return error
  if (err) throw err;

  return response.data.accessToken;
};

const getAllUsers = async (token, userID) => {
  const requestInstance = axios.create({
    url: `${AUTH_URL}:${AUTH_PORT}/api/users/all`,
    method: 'GET',
    headers: { Cookie: `auth=${token}` }, // Middleware in auth service expects token in req.cookie.auth
  });

  const [err, response] = await awaitHandler(requestInstance());

  // Array not returned, if the request failes, HTML for the login page is returned
  if (err || !Array.isArray(response.data)) {
    const error = err ? err : 'Users not returned from auth service';
    throw new Error(error);
  }

  // Reduce objects to only needed fields
  let users = response.data.map(({ email, firstName, id, lastName }) => ({
    email,
    firstName,
    id,
    lastName,
  }));

  // Filter out the user who made the request
  users = users.filter(({ id }) => id !== userID);

  return users;
};

const updateLastWorkspace = async (workspaceID, userID) => {
  let [err] = await awaitHandler(userModel.update({ lastWorkspace: workspaceID }, { where: { id: userID } }));

  if (err) throw err;

  return;
};

module.exports = { createUser, getAllUsers, getSuperUserToken, updateLastWorkspace };
