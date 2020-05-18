const router = require('express').Router();
const { createCluster, getClusters } = require('../../utils/cluster');

router.get('/all', async (req, res) => {
  let clusters;

  try {
    clusters = await getClusters();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  res.status(200).json(clusters);
});

router.post('/create', async (req, res) => {
  let newCluster;

  try {
    newCluster = await createCluster(req.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  res.status(200).json(newCluster);
});

module.exports = router;
