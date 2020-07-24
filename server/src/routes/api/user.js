const router = require('express').Router();

// Utils
const { getUserByID } = require('../../utils/auth');
const { getAllUsers, getSuperUserToken } = require('../../utils/user');
const errHandler = require('../../utils/errHandler');
const { getWorkspaces } = require('../../utils/workspace');

router.get('/getdata', async (req, res) => {
  const { id: userID, username } = req.user;
  let user, workspaces;

  try {
    user = await getUserByID(userID);
    workspaces = await getWorkspaces(userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  // Add auth service username to user object
  user = { ...user, username, workspaces };

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

module.exports = router;
