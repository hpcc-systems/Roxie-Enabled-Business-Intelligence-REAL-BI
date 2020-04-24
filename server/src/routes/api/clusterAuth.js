const router = require('express').Router();
const { createClusterAuth } = require('../../utils/clusterAuth');

router.post('/create', async (req, res) => {
  const {
    body: { clusterID, password, username },
    user: { id: userID },
  } = req;
  let clusterAuth;

  try {
    clusterAuth = await createClusterAuth(clusterID, password, userID, username);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(201).json(clusterAuth);
});

module.exports = router;
