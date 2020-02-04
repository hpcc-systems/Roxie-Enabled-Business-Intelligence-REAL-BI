const router = require('express').Router();
const { getClusterByID } = require('../utils/cluster');
const {
  getQueryFieldsFromCluster,
  getQueryListFromCluster,
  getQueryParamsFromCluster,
} = require('../utils/query');

router.get('/search', async (req, res) => {
  const { clusterID, keyword = '*' } = req.query;
  let cluster;

  try {
    cluster = await getClusterByID(clusterID);
    queryList = await getQueryListFromCluster(cluster, keyword);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json(queryList);
});

router.get('/info', async (req, res) => {
  const { clusterID, query } = req.query;
  let queryInfo = {};
  let cluster;

  try {
    cluster = await getClusterByID(clusterID);
    queryInfo.params = await getQueryParamsFromCluster(cluster, query);
    queryInfo.fields = await getQueryFieldsFromCluster(cluster, query);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json(queryInfo);
});

module.exports = router;
