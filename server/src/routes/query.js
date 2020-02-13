const router = require('express').Router();
const { getClusterByID } = require('../utils/cluster');
const {
  getDataFromQuery,
  getQueryDatasetsFromCluster,
  getQueryListFromCluster,
  getQueryParamsFromCluster,
} = require('../utils/query');
const { getChartByID } = require('../utils/chart');

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
    queryInfo.datasets = await getQueryDatasetsFromCluster(cluster, query);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json(queryInfo);
});

router.get('/data', async (req, res) => {
  const { chartID, clusterID } = req.query;
  let data = [];
  let chart, cluster;

  try {
    cluster = await getClusterByID(clusterID);
    chart = await getChartByID(chartID);
    data = await getDataFromQuery(cluster, chart);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }

  return res.status(200).json(data);
});

module.exports = router;
