const router = require('express').Router();

// Utils
const { getUserByID } = require('../../utils/auth');
const { updateDirectoryDepth, updateLastDashboard, updateUserDirectory } = require('../../utils/user');

router.get('/getdata', async (req, res) => {
  const { id: userID } = req.user;
  let user;

  try {
    user = await getUserByID(userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
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
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
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
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
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
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(202).end();
});

router.get('/all', async (req, res) => {
  console.log('Get all users empty method', req, res);
});

module.exports = router;
