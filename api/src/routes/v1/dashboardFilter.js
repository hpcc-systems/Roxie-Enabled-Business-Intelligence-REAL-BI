const router = require('express').Router();
const { getClusterByID } = require('../../utils/cluster');
const { getDashboardByID } = require('../../utils/dashboard');
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
    const { permission = 'Read-Only' } = await getDashboardByID(body.dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

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
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    await updateFilter(filterObj, sourceID);
    const filters = await getDashboardFiltersByDashboardID(dashboardID, userID);

    return res.status(200).json(filters);
  } catch (error) {
    next(error);
  }
});

router.put('/filters', async (req, res, next) => {
  const {
    body: { dashboardID, filtersArr = [] },
    user: { id: userID },
  } = req;
  const parsedArr = JSON.parse(filtersArr);

  try {
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    // Update altered filters
    const promises = [];
    parsedArr.forEach(filter => {
      const sourceID = filter?.source?.id;
      delete filter.source;

      promises.push(updateFilter(filter, sourceID));
    });
    await Promise.all(promises);

    const filters = await getDashboardFiltersByDashboardID(dashboardID, userID);

    return res.status(200).json(filters);
  } catch (error) {
    next(error);
  }
});

router.delete('/filters', async (req, res, next) => {
  const {
    query: { dashboardID, filtersArr = [] },
    user: { id: userID },
  } = req;
  const parsedArr = JSON.parse(filtersArr);

  try {
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    // Update altered filters
    const promises = [];
    parsedArr.forEach(filter => promises.push(deleteFilter(filter.id)));
    await Promise.all(promises);

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
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

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
