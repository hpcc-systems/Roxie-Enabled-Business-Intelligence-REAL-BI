const router = require('express').Router();
const axios = require('axios');

// Utils
const { getUserByID } = require('../../utils/auth');
const { getAllUsers, getSuperUserToken } = require('../../utils/user');
const errHandler = require('../../utils/errHandler');

// Constants
const { AUTH_PORT, AUTH_URL } = process.env;

router.get('/getdata', async (req, res) => {
  const { id: userID, username } = req.user;
  let user;

  try {
    user = await getUserByID(userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  // Add auth service username to user object
  user = { ...user, username };

  return res.status(200).json(user);
});

router.get('/all', async (req, res) => {
  const { id: userID } = req.user;
  let token, users;

  try {
    token = await getSuperUserToken();
    users = await getAllUsers(token, userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(200).json(users);
});

router.post('/changepwd', async (req, res) => {
  const {
    body: { oldPwd, newPwd, newPwd2 },
    user: { username },
  } = req;
  let token = req.headers.authorization;

  // Create axios request objects
  const url = `${AUTH_URL}:${AUTH_PORT}/api/users/changepwd`;
  const options = { headers: { Cookie: `auth=${token}` } };
  const reqBody = { username, oldpassword: oldPwd, newpassword: newPwd, confirmpassword: newPwd2 };

  try {
    await axios.post(url, reqBody, options);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  res.status(202).send('Password Changed');
});

module.exports = router;
