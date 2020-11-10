const router = require('express').Router();
const {
  checkForClusterCreds,
  createClusterCreds,
  updateClusterCreds,
} = require('../../utils/clusterCredentials');

router.post('/', async (req, res, next) => {
  const {
    body: { clusterID, password, username },
    user: { id: userID },
  } = req;

  try {
    await createClusterCreds(clusterID, password, userID, username);

    return res.status(201).json({ message: 'Cluster Credentials Saved' });
  } catch (error) {
    return next(error);
  }
});

router.get('/check', async (req, res, next) => {
  const {
    query: { clusterID },
    user: { id: userID },
  } = req;

  try {
    const clusterCreds = await checkForClusterCreds(clusterID, userID);
    return res.status(200).json({ hasCreds: Boolean(clusterCreds) });
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  const {
    body: { clusterID, password, username },
    user: { id: userID },
  } = req;

  try {
    await updateClusterCreds(clusterID, password, userID, username);

    return res.status(200).json({ message: 'Cluster Credentials Updated' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
