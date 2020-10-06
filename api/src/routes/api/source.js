const router = require('express').Router();
const errHandler = require('../../utils/errHandler');

const { body, validationResult } = require('express-validator/check');

// Utils
const {
  getClusterByID,
  getFileDataFromCluster,
  getFileMetaDataFromCluster,
  getQueryDataFromCluster,
  getQueryDatasetsFromCluster,
  getLogicalFilesFromCluster,
  getQueryListFromCluster,
  getQueryParamsFromCluster,
  getWorkunitDataFromCluster,
  getWorkunitDataFromClusterWithParams,
} = require('../../utils/cluster');
const { getChartByID } = require('../../utils/chart');
const { getDashboardByID } = require('../../utils/dashboard');
const { createDashboardSource, getDashboardSource } = require('../../utils/dashboardSource');
const { createSource, getSourceByHpccID, getSourceByID } = require('../../utils/source');

router.get('/search', async (req, res) => {
  const {
    query: { clusterID, keyword = '*', sourceType = 'query' },
    user: { id: userID },
  } = req;
  let cluster, list;

  try {
    cluster = await getClusterByID(clusterID);

    switch (sourceType) {
      case 'file':
        list = await getLogicalFilesFromCluster(cluster, keyword, userID);
        break;
      default:
        list = await getQueryListFromCluster(cluster, keyword, userID);
    }
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).json(errMsg);
  }

  return res.status(200).send(list);
});

router.get('/info', async (req, res) => {
  const {
    query: { clusterID, source, sourceType = 'query' },
    user: { id: userID },
  } = req;
  let sourceInfo = {};
  let cluster;

  try {
    cluster = await getClusterByID(clusterID);

    switch (sourceType) {
      case 'file':
        sourceInfo = await getFileMetaDataFromCluster(cluster, JSON.parse(source), userID);
        break;
      default:
        sourceInfo.params = await getQueryParamsFromCluster(cluster, JSON.parse(source), userID);
        sourceInfo.datasets = await getQueryDatasetsFromCluster(cluster, JSON.parse(source), userID);
    }
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).json(errMsg);
  }

  return res.status(200).json(sourceInfo);
});

router.get('/editordata', async (req, res) => {
  const {
    query: { dataOptions, clusterID, sourceType },
    user: { id: userID },
  } = req;
  let data = [];
  let cluster;

  try {
    cluster = await getClusterByID(clusterID);

    switch (sourceType) {
      case 'file':
        data = await getFileDataFromCluster(cluster, JSON.parse(dataOptions), userID);
        break;
      default:
        data = await getQueryDataFromCluster(cluster, JSON.parse(dataOptions), userID);
    }
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).json(errMsg);
  }

  return res.status(200).json(data);
});

router.post(
  '/create',
  [
    body('source.hpccID')
      .not()
      .isEmpty()
      .withMessage('hpccID not found'),
  ],
  async (req, res) => {
    const { dashboardID, source } = req.body;
    let dashboardSource, dbSource;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      // Look for existing source in DB
      dbSource = await getSourceByHpccID(source);

      // Source not found
      if (Object.keys(dbSource).length === 0) {
        dbSource = await createSource(source);
      } else {
        // Look for existing dashboard source in DB
        dashboardSource = await getDashboardSource(dashboardID, dbSource.id);
      }

      // Dashboard Source not already in DB
      if (!dashboardSource || Object.keys(dashboardSource).length === 0) {
        await createDashboardSource(dashboardID, dbSource.id);
      }
    } catch (err) {
      const { errMsg, status } = errHandler(err);
      return res.status(status).json(errMsg);
    }

    return res.status(201).json(dbSource);
  },
);

router.get('/data', async (req, res) => {
  const {
    query: { chartID, clusterID, interactiveObj, dashboardID },
    user: { id: userID },
  } = req;
  const parsedObj = JSON.parse(interactiveObj);
  const dashboardFilters = [];
  const interactiveFilters = [];

  let chartParams, cluster, dashboard, data, newParam;

  try {
    cluster = await getClusterByID(clusterID);
    const { config, source } = await getChartByID(chartID);

    // Static textboxes won't have a source object
    if (Object.keys(source).length === 0) {
      return res.status(200).end();
    }

    // Default params to chart params or empty array
    chartParams = config.params || [];

    // Get dashboard level filters
    dashboard = await getDashboardByID(dashboardID);
    const { filters = [], relations = {} } = dashboard;

    // Determine if the current source has a mapped parameter
    if (Array.isArray(filters)) {
      filters.forEach(filter => {
        const { params, value } = filter;

        // Loop through and add params that match current chart
        params.forEach(({ targetChart, targetParam }) => {
          if (chartID === targetChart) {
            dashboardFilters.push({ name: targetParam, value });
          }
        });
      });
    }

    // Get data for interactive click event
    if (parsedObj.value && chartID !== parsedObj.chartID) {
      if (relations[parsedObj.chartID]) {
        relations[parsedObj.chartID].forEach(({ sourceField, targetChart, targetField }) => {
          if (chartID === targetChart && parsedObj.field === sourceField) {
            interactiveFilters.push({ name: targetField, value: parsedObj.value });
          }
        });
      }
    }

    // Set hierarchy of importance
    newParam =
      interactiveFilters.length > 0
        ? interactiveFilters
        : dashboardFilters.length > 0
        ? dashboardFilters
        : chartParams;

    switch (source.type) {
      case 'file':
        data = await getFileDataFromCluster(cluster, { params: newParam, source }, userID);
        break;
      case 'ecl':
        if (newParam.length > 0) {
          data = await getWorkunitDataFromClusterWithParams(cluster, config, newParam, source, userID);
        } else {
          data = await getWorkunitDataFromCluster(cluster, config, source, userID);
        }
        break;
      default:
        data = await getQueryDataFromCluster(cluster, { params: newParam, source }, userID);
    }
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).json(errMsg);
  }

  return res.status(200).json(data);
});

router.get('/filter/data', async (req, res) => {
  const {
    query: { clusterID, sourceDataset, sourceID },
    user: { id: userID },
  } = req;
  let cluster, data, source;

  try {
    cluster = await getClusterByID(clusterID);
    source = await getSourceByID(sourceID);

    switch (source.type) {
      case 'file':
        data = await getFileDataFromCluster(cluster, { params: [], source }, userID);
        break;
      case 'ecl':
        data = await getWorkunitDataFromCluster(cluster, { dataset: sourceDataset }, source, userID);
        break;
      default:
        data = await getQueryDataFromCluster(cluster, { params: [], source }, userID);
    }
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).json(errMsg);
  }

  return res.status(200).json(data);
});

module.exports = router;
