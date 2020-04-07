const router = require('express').Router();
const { getClusters } = require('../../utils/cluster');

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

module.exports = router;
