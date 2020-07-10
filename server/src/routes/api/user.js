const router = require('express').Router();

// Utils
const { getUserByID } = require('../../utils/auth');
const {
  getAllUsers,
  getSuperUserToken,
  updateDirectoryDepth,
  updateLastDashboard,
  updateUserDirectory,
} = require('../../utils/user');
const errHandler = require('../../utils/errHandler');

router.get('/getdata', async (req, res) => {
  const { id: userID } = req.user;
  let user;

  try {
    user = await getUserByID(userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(200).json(user);
});

router.put('/updatedirectory', async (req, res) => {
  const {
    body: { directory },
    user: { id: userID },
  } = req;

  try {
    await updateUserDirectory(directory, userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(202).end();
});

router.put('/updatelastdashboard', async (req, res) => {
  const {
    body: { dashboardID },
    user: { id: userID },
  } = req;

  try {
    await updateLastDashboard(dashboardID, userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(202).end();
});

router.put('/updatedirectorydepth', async (req, res) => {
  const {
    body: { directoryDepth },
    user: { id: userID },
  } = req;

  try {
    await updateDirectoryDepth(directoryDepth, userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(202).end();
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
