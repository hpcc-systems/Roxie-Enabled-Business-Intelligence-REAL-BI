const router = require('express').Router();

// Utils
const {
  getClusterByID,
  getDataFromCluster,
  getQueryDatasetsFromCluster,
  getQueryListFromCluster,
  getQueryParamsFromCluster,
} = require('../../utils/cluster');
const { getChartByID } = require('../../utils/chart');
const { createDashboardSource, getDashboardSource } = require('../../utils/dashboardSource');
const { createQuery, getQueriesByDashboardID, getQueryByHpccID } = require('../../utils/query');
const { createQueryParams, findAllQueryParams } = require('../../utils/queryParam');

router.get('/search', async (req, res) => {
  const {
    query: { clusterID, keyword = '*' },
    user: { id: userID },
  } = req;
  let cluster, queryList;

  try {
    cluster = await getClusterByID(clusterID);
    queryList = await getQueryListFromCluster(cluster, keyword, userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json(queryList);
});

router.get('/info', async (req, res) => {
  const {
    query: { clusterID, query },
    user: { id: userID },
  } = req;
  const queryInfo = {};
  let cluster;

  try {
    cluster = await getClusterByID(clusterID);
    queryInfo.params = await getQueryParamsFromCluster(cluster, JSON.parse(query), userID);
    queryInfo.datasets = await getQueryDatasetsFromCluster(cluster, JSON.parse(query), userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json(queryInfo);
});

router.get('/editordata', async (req, res) => {
  const {
    query: { dataOptions, clusterID },
    user: { id: userID },
  } = req;
  let data = [];
  let cluster;

  try {
    cluster = await getClusterByID(clusterID);
    data = await getDataFromCluster(cluster, JSON.parse(dataOptions), userID);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }

  return res.status(200).json(data);
});

router.post('/create', async (req, res) => {
  const { dashboardID, query } = req.body;
  let dashboardSource, dbQuery;

  try {
    // Look for existing query in DB
    dbQuery = await getQueryByHpccID(query);

    // Query not found
    if (Object.keys(dbQuery).length === 0) {
      dbQuery = await createQuery(query);
      await createQueryParams(dbQuery.id, query, dashboardID, null);
    } else {
      // Look for existing dashboard source in DB
      dashboardSource = await getDashboardSource(dashboardID, dbQuery.id);
    }

    // Dashboard Source not already in DB
    if (!dashboardSource || Object.keys(dashboardSource).length === 0) {
      await createDashboardSource(dashboardID, dbQuery.id);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(201).json(dbQuery);
});

router.get('/data/single', async (req, res) => {
  const {
    query: { clusterID, dashboardID },
    user: { id: userID },
  } = req;
  let cluster, params, queries;
  let data = {};

  try {
    cluster = await getClusterByID(clusterID);
    queries = await getQueriesByDashboardID(dashboardID);
    params = await findAllQueryParams(dashboardID, null);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  if (!queries) {
    return res.status(500).json({ msg: 'Internal Error' });
  }

  // Create nested data objects with the name of the query as the key
  for (let query of queries) {
    const { name } = query;

    try {
      query = await getDataFromCluster(cluster, { params, query }, userID);
    } catch (err) {
      return console.error(err);
    }

    data[name] = query;
  }

  return res.status(200).json(data);
});

router.get('/data/multiple', async (req, res) => {
  const {
    query: { chartID, clusterID },
    user: { id: userID },
  } = req;
  let chart, cluster, data, params;

  try {
    cluster = await getClusterByID(clusterID);
    chart = await getChartByID(chartID);
    params = await findAllQueryParams(null, chartID);
    data = await getDataFromCluster(cluster, { params, query: chart.query }, userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json(data);
});

module.exports = router;
