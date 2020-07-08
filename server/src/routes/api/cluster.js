const router = require('express').Router();
const { createCluster, getClusters } = require('../../utils/cluster');
const errHandler = require('../../utils/errHandler');

router.get('/all', async (req, res) => {
  let clusters;

  try {
    clusters = await getClusters();
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  res.status(200).json(clusters);
});

router.post('/create', async (req, res) => {
  let newCluster;

  try {
    newCluster = await createCluster(req.body);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  res.status(200).json(newCluster);
});

module.exports = router;
