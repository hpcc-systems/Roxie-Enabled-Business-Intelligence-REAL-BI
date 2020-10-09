const router = require('express').Router();
const {
  createCluster,
  getClusterByID,
  getClusters,
  getECLParams,
  getTargetClusters,
  submitWorkunit,
} = require('../../utils/cluster');
const errHandler = require('../../utils/errHandler');
const { validate, validateEclEditorExecution } = require('../../utils/validation');

router.get('/all', async (req, res) => {
  let clusters;

  try {
    clusters = await getClusters();
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  res.status(200).json(clusters);
});

router.post('/create', async (req, res) => {
  let newCluster;

  try {
    newCluster = await createCluster(req.body);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  res.status(200).json(newCluster);
});

router.post('/params', async (req, res) => {
  const {
    body: { clusterID, Wuid },
    user: { id: userID },
  } = req;
  let cluster, params;

  try {
    cluster = await getClusterByID(clusterID);
    params = await getECLParams(cluster, Wuid, userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  res.status(200).send(params);
});

router.post('/targetclusters', async (req, res) => {
  const {
    body: { clusterID },
    user: { id: userID },
  } = req;
  let cluster, clusters;

  try {
    cluster = await getClusterByID(clusterID);
    clusters = await getTargetClusters(cluster, userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  res.status(200).send(clusters);
});

router.post('/submitworkunit', [validateEclEditorExecution(), validate], async (req, res) => {
  const {
    body: { clusterID, targetCluster, eclScript },
    user: { id: userID },
  } = req;
  let cluster, workunitObj;

  try {
    cluster = await getClusterByID(clusterID);
    workunitObj = await submitWorkunit(cluster, targetCluster, eclScript, userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  res.status(200).send(workunitObj);
});

module.exports = router;
