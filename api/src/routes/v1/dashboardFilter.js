const router = require('express').Router();
const { getClusterByID } = require('../../utils/cluster');
const {
  createFilter,
  createFilterValue,
  getDashboardFilter,
  updateFilterValue,
  getDashboardFiltersByDashboardID,
  updateFilter,
  deleteFilter,
} = require('../../utils/dashboardFilter');
const { getWorkunitDataFromCluster } = require('../../utils/hpccEcl');
const { getFileDataFromCluster } = require('../../utils/hpccFiles');
const { getQueryDataFromCluster } = require('../../utils/hpccQueries');

router.post('/', async (req, res, next) => {
  const {
    body,
    user: { id: userID },
  } = req;

  try {
    let newFilter = await createFilter(body);
    await createFilterValue(newFilter.id, userID);
    newFilter = await getDashboardFilter(newFilter.id, userID);

    return res.status(201).json(newFilter);
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  const {
    body: { dashboardID, filterObj, sourceID },
    user: { id: userID },
  } = req;

  try {
    await updateFilter(filterObj, sourceID);
    const filters = await getDashboardFiltersByDashboardID(dashboardID, userID);

    return res.status(200).json(filters);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  const {
    query: { dashboardID, filterID },
    user: { id: userID },
  } = req;

  try {
    await deleteFilter(filterID);
    const filters = await getDashboardFiltersByDashboardID(dashboardID, userID);

    return res.status(200).json(filters);
  } catch (error) {
    next(error);
  }
});

router.get('/data', async (req, res, next) => {
  const {
    query: { clusterID, filterID },
    user: { id: userID },
  } = req;

  try {
    const cluster = await getClusterByID(clusterID);
    const { configuration, source } = await getDashboardFilter(filterID, userID);
    let data;

    // Static textboxes won't have a source object
    if (!source) {
      return res.status(200).end();
    }

    const options = { params: [], source };

    switch (source.type) {
      case 'file':
        data = await getFileDataFromCluster(cluster, options, userID);
        break;
      case 'ecl':
        data = await getWorkunitDataFromCluster(cluster, configuration, source, userID);
        break;
      default:
        data = await getQueryDataFromCluster(cluster, { ...options, dataset: configuration.dataset }, userID);
    }

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.put('/value', async (req, res, next) => {
  const {
    body: { dashboardID, valueObj },
    user: { id: userID },
  } = req;

  try {
    await updateFilterValue(valueObj);
    const filters = await getDashboardFiltersByDashboardID(dashboardID, userID);

    res.status(200).json(filters);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
