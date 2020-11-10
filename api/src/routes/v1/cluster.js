const router = require('express').Router();
const { createCluster, getAllClusters } = require('../../utils/cluster');

router.get('/all', async (req, res, next) => {
  try {
    const clusters = await getAllClusters();

    res.status(200).json(clusters);
  } catch (error) {
    next(error);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const newCluster = await createCluster(req.body);

    res.status(200).json(newCluster);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
