const router = require('express').Router();
const logger = require('../../config/logger');
const errHandler = require('../../utils/errHandler');

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
const { getChartByID, getEclOptionsByWuID } = require('../../utils/chart');
const { getDashboardByID } = require('../../utils/dashboard');
const { createDashboardSource, getDashboardSource } = require('../../utils/dashboardSource');
const { createSource, getSourcesByDashboardID, getSourceByHpccID } = require('../../utils/source');
const { getDashboardParams } = require('../../utils/dashboardParam');

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

router.post('/create', async (req, res) => {
  const { dashboardID, source } = req.body;
  let dashboardSource, dbSource;

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
});

router.get('/data/single', async (req, res) => {
  const {
    query: { clusterID, dashboardID },
    user: { id: userID },
  } = req;
  let chart, cluster, params, sources;
  let data = {};

  try {
    cluster = await getClusterByID(clusterID);
    sources = await getSourcesByDashboardID(dashboardID);
    params = await getDashboardParams(dashboardID, userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).json(errMsg);
  }

  if (!sources) {
    logger.error('No Sources Found');
    return res.status(500).json({ msg: 'Internal Error' });
  }

  // Create nested data objects with the name of the source as the key
  for (let source of sources) {
    const { id, name, type } = source;
    let newParam = [];

    // Determine if the current source has a mapped parameter
    params.map(({ mappedParams, value }) => {
      const obj = mappedParams.find(({ sourceID }) => sourceID === id);

      if (obj && Object.keys(obj).length > 0) {
        newParam = [{ name: obj.parameter, value }];
      }
    });

    try {
      switch (type) {
        case 'file':
          source = await getFileDataFromCluster(cluster, { params: newParam, source }, userID);
          break;
        case 'ecl':
          chart = await getEclOptionsByWuID(source.hpccID);

          if (newParam.length > 0) {
            source = await getWorkunitDataFromClusterWithParams(
              cluster,
              chart.config,
              newParam,
              source,
              userID,
            );
          } else {
            source = await getWorkunitDataFromCluster(cluster, chart.config, source, userID);
          }

          break;
        default:
          source = await getQueryDataFromCluster(cluster, { params: newParam, source }, userID);
      }
    } catch (err) {
      return logger.error(err);
    }

    data[name] = source;
  }

  return res.status(200).json(data);
});

router.get('/data/multiple', async (req, res) => {
  const {
    query: { chartID, clusterID, interactiveObj, dashboardID },
    user: { id: userID },
  } = req;
  const parsedObj = JSON.parse(interactiveObj);
  let cluster, data, newParam, params;

  try {
    cluster = await getClusterByID(clusterID);
    const { config, source } = await getChartByID(chartID);

    // Static textboxes won't have a source object
    if (Object.keys(source).length === 0) {
      return res.status(200).end();
    }

    // Default params to chart params or empty array
    newParam = config.params || [];

    // Get dashboard level params
    params = await getDashboardParams(dashboardID, userID);

    // Determine if the current source has a mapped parameter
    params.map(({ mappedParams, value }) => {
      const obj = mappedParams.find(({ sourceID }) => sourceID === source.id);

      if (obj && Object.keys(obj).length > 0) {
        newParam = [{ name: obj.parameter, value }];
      }
    });

    // Get data for interactive click event
    if (parsedObj.value && chartID !== parsedObj.chartID) {
      const { relations = {} } = await getDashboardByID(dashboardID);

      if (relations[parsedObj.chartID]) {
        relations[parsedObj.chartID].map(({ originField, mappedChart, mappedField }) => {
          console.log('inside map\n', parsedObj.field, originField, parsedObj.field === originField);

          if (chartID === mappedChart && parsedObj.field === originField) {
            newParam = [{ name: mappedField, value: parsedObj.value }];
          }
        });
      }
    }

    console.log('newParam\n', newParam);

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

module.exports = router;
