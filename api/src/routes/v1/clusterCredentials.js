const router = require('express').Router();
const { decryptHash } = require('../../utils/auth');
const { getClusterByID } = require('../../utils/cluster');
const {
  checkForClusterCreds,
  createClusterCreds,
  updateClusterCreds,
  isClusterCredsValid,
} = require('../../utils/clusterCredentials');

router.post('/', async (req, res, next) => {
  const {
    body: { clusterID, password, username },
    user: { id: userID },
  } = req;

  try {
    const cluster = await getClusterByID(clusterID);
    await isClusterCredsValid(cluster, username, password);
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
    let respond = {};
    const clusterCreds = await checkForClusterCreds(clusterID, userID);
    if (clusterCreds) {
      respond.hasCreds = true;
      const cluster = await getClusterByID(clusterID);
      try {
        await isClusterCredsValid(cluster, clusterCreds.username, decryptHash(clusterCreds.password));
        respond.isCredsValid = true;
      } catch (err) {
        respond.isCredsValid = false;
      }
    } else {
      respond.hasCreds = false;
      respond.isCredsValid = false;
    }
    return res.status(200).json(respond);
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
    const cluster = await getClusterByID(clusterID);
    await isClusterCredsValid(cluster, username, password);
    await updateClusterCreds(clusterID, password, userID, username);

    return res.status(200).json({ message: 'Cluster Credentials Updated' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
