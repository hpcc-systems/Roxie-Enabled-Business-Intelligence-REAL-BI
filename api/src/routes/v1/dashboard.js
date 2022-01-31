const router = require('express').Router();

const { getClusterCreds, isClusterCredsValid } = require('../../utils/clusterCredentials');
// Utils
const {
  createDashboard,
  deleteDashboardByID,
  getDashboardByID,
  getSharedDashboardUsers,
  updateDashboardByID,
  updateDashboardLayout,
  getDashboardPermission,
} = require('../../utils/dashboard');
const { createDashboardPermission } = require('../../utils/dashboardPermission');

router.post('/', async (req, res, next) => {
  const {
    body: { dashboard, workspaceID },
    user: { id: userID },
  } = req;

  try {
    const newDashboardID = await createDashboard(dashboard, workspaceID);
    await createDashboardPermission(newDashboardID, userID, 'Owner');
    const newDashboard = await getDashboardByID(newDashboardID, userID);

    return res.status(201).json(newDashboard);
  } catch (error) {
    next(error);
  }
});

router.get('/info', async (req, res, next) => {
  const {
    query: { dashboardID },
    user: { id: userID },
  } = req;

  try {
    const dashboard = await getDashboardByID(dashboardID, userID);

    if (dashboard.cluster) {
      const clusterCreds = await getClusterCreds(dashboard.cluster.id, userID);
      try {
        await isClusterCredsValid(dashboard.cluster, clusterCreds.username, clusterCreds.password);
        dashboard.isClusterCredsValid = true;
      } catch (err) {
        dashboard.isClusterCredsValid = false;
      }
    } else {
      dashboard.isClusterCredsValid = false;
    }

    return res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  const {
    body: { clusterID, dashboardID, name },
    user: { id: userID },
  } = req;

  try {
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    await updateDashboardByID(clusterID, dashboardID, name);
    const dashboard = await getDashboardByID(dashboardID, userID);
    return res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  const {
    query: { dashboardID },
    user: { id: userID },
  } = req;

  try {
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    await deleteDashboardByID(dashboardID);
    return res.status(200).end();
  } catch (error) {
    next(error);
  }
});

router.delete('/multiple', async (req, res, next) => {
  const {
    query: { dashboardIDArray = [] },
    user: { id: userID },
  } = req;

  try {
    const promises = [];

    for await (const dashboardID of dashboardIDArray) {
      const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

      if (permission !== 'Owner') continue;

      promises.push(deleteDashboardByID(dashboardID));
    }
    await Promise.all(promises);

    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
});

router.get('/shared_with', async (req, res, next) => {
  const {
    query: { dashboardID },
    user: { id: userID },
  } = req;

  try {
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    const users = await getSharedDashboardUsers(dashboardID, userID);

    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
});

router.post('/update_layouts', async (req, res, next) => {
  const { newLayout, dashboardId } = req.body;
  const user = req.user;
  const newLayoutToJson = JSON.stringify(newLayout);

  try {
    //1. check if user has rights to modify layout
    const permission = await getDashboardPermission(dashboardId, user.id);
    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }
    //2. update layout in DB
    await updateDashboardLayout(dashboardId, newLayoutToJson);
    res.status(200).send('ok');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
