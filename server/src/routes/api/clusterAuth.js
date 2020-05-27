const router = require('express').Router();
const { checkForClusterAuth, createClusterAuth, updateClusterAuth } = require('../../utils/clusterAuth');

router.post('/create', async (req, res) => {
  const {
    body: { clusterID, password, username },
    user: { id: userID },
  } = req;
  let clusterAuth;

  try {
    clusterAuth = await checkForClusterAuth(clusterID, userID);

    // Extra check to make sure creds don't exist for the user for the particular cluster
    if (Object.keys(clusterAuth).length === 0) {
      // Create new user cluster credentials
      clusterAuth = await createClusterAuth(clusterID, password, userID, username);
    } else {
      // Update existing creds in DB
      clusterAuth = await updateClusterAuth(clusterID, password, userID, username);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(201).json(clusterAuth);
});

router.get('/check', async (req, res) => {
  const {
    query: { clusterID },
    user: { id: userID },
  } = req;
  let clusterAuth;

  try {
    clusterAuth = await checkForClusterAuth(clusterID, userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(201).json(clusterAuth);
});

module.exports = router;
