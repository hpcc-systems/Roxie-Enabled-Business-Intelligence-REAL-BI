const router = require('express').Router();
const { getClusterByID } = require('../../utils/cluster');
const {
  getFilesFromCluster,
  getFileDatasetFromCluster,
  getFileDataFromCluster,
  getTreeViewDataFromCluster,
} = require('../../utils/hpccFiles');
const {
  getQueriesFromCluster,
  getQueryDatasetsFromCluster,
  getQueryParamsFromCluster,
  getQueryDataFromCluster,
} = require('../../utils/hpccQueries');
const {
  getTargetClusters,
  submitWorkunitToCluster,
  getECLParamsFromScript,
  getECLscript,
} = require('../../utils/hpccEcl');
const { validate, validateEclEditorExecution } = require('../../utils/validation');

router.get('/keyword', async (req, res, next) => {
  const {
    query: { clusterID, keyword = '*', sourceType = 'query' },
    user: { id: userID },
  } = req;

  try {
    const cluster = await getClusterByID(clusterID);
    let results;

    switch (sourceType) {
      case 'file':
        results = await getFilesFromCluster(cluster, keyword, userID);
        break;
      case 'query':
      default:
        results = await getQueriesFromCluster(cluster, keyword, userID);
    }

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

router.post('/treeViewData', async (req, res, next) => {
  const user = req.user;
  const cluserId = req.body.clusterId;
  const scope = req.body.scope;
  try {
    const cluster = await getClusterByID(cluserId);
    const result = await getTreeViewDataFromCluster(cluster, user.id, scope);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

router.get('/datasets', async (req, res, next) => {
  const {
    query: { clusterID, source, sourceType = 'query' },
    user: { id: userID },
  } = req;

  try {
    const cluster = await getClusterByID(clusterID);
    let sourceInfo;

    switch (sourceType) {
      case 'file':
        sourceInfo = await getFileDatasetFromCluster(cluster, JSON.parse(source), userID);
        break;
      case 'query':
      default:
        sourceInfo = {};
        sourceInfo.datasets = await getQueryDatasetsFromCluster(cluster, JSON.parse(source), userID);
        sourceInfo.params = await getQueryParamsFromCluster(cluster, JSON.parse(source), userID);
    }

    return res.status(200).json(sourceInfo);
  } catch (error) {
    next(error);
  }
});

router.get('/preview_data', async (req, res, next) => {
  const {
    query: { clusterID, dataOptions, sourceType },
    user: { id: userID },
  } = req;

  try {
    const cluster = await getClusterByID(clusterID);
    let data;

    switch (sourceType) {
      case 'file':
        data = await getFileDataFromCluster(cluster, JSON.parse(dataOptions), userID);
        break;
      default:
        data = await getQueryDataFromCluster(cluster, JSON.parse(dataOptions), userID);
    }

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/editor/clusters', async (req, res, next) => {
  const {
    body: { clusterID },
    user: { id: userID },
  } = req;
  let cluster;

  try {
    cluster = await getClusterByID(clusterID);
  } catch (error) {
    return next(error);
  }

  try {
    const targetClusters = await getTargetClusters(cluster, userID);

    res.status(200).json(targetClusters);
  } catch (err) {
    res.status(err?.response?.status || 500);
    const error = new Error(`${err?.response?.data || 'Unknown error'}`);
    return next(error);
  }
});

router.post('/editor/filename', async (req, res, next) => {
  const {
    body: { fileName, clusterID },
    user: { id: userID },
  } = req;

  let cluster;

  try {
    cluster = await getClusterByID(clusterID);
  } catch (error) {
    return next(error);
  }

  try {
    const result = await getECLscript(fileName, cluster, userID);

    res.status(200).json(result);
  } catch (err) {
    res.status(err?.response?.status || 500);
    const error = new Error(`${err?.response?.data || err.message || 'Unknown error'}`);
    return next(error);
  }
});

router.post('/editor/submit_workunit', [validateEclEditorExecution(), validate], async (req, res, next) => {
  const {
    body: { clusterID, targetCluster, eclScript },
    user: { id: userID },
  } = req;
  let cluster;

  try {
    cluster = await getClusterByID(clusterID);
  } catch (error) {
    return next(error);
  }

  try {
    const workunitObj = await submitWorkunitToCluster(cluster, targetCluster, eclScript, userID);

    res.status(200).json(workunitObj);
  } catch (error) {
    next(error);
  }
});

router.post('/editor/params', async (req, res, next) => {
  const {
    body: { clusterID, Wuid },
    user: { id: userID },
  } = req;
  let cluster;

  try {
    cluster = await getClusterByID(clusterID);
  } catch (error) {
    return next(error);
  }

  try {
    const params = await getECLParamsFromScript(cluster, Wuid, userID);

    res.status(200).json(params);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
