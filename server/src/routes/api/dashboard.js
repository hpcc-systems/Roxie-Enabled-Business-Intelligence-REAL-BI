const router = require('express').Router();
const logger = require('../../config/logger');

// Utils
const {
  createDashboard,
  deleteDashboardByID,
  getDashboardByID,
  updateDashboardByID,
} = require('../../utils/dashboard');
const { createDashboardPermission, getDashboardPermission } = require('../../utils/dashboardPermission');
const errHandler = require('../../utils/errHandler');

router.post('/create', async (req, res) => {
  const {
    body: { clusterID, name },
    user: { id: userID },
  } = req;
  let dashboard;

  try {
    dashboard = await createDashboard(clusterID, name, userID);
    await createDashboardPermission(dashboard.id, userID, 'Owner');
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(201).json(dashboard);
});

router.get('/info', async (req, res) => {
  const {
    query: { dashboardID },
    user: { id: userID },
  } = req;
  let dashboard, permissionObj;

  try {
    dashboard = await getDashboardByID(dashboardID);
    permissionObj = await getDashboardPermission(dashboardID, userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(200).json({ ...dashboard, role: permissionObj.role });
});

router.put('/', async (req, res) => {
  const {
    body,
    user: { id: userID },
  } = req;
  let permissionObj;

  try {
    permissionObj = await getDashboardPermission(body.directoryObj.id, userID);

    // User is the owner of the dashboard
    if (permissionObj.role === 'Owner') {
      await updateDashboardByID(body);
    } else {
      // User did not have sufficient permissions
      logger.error('Permission Denied');
      return res.status(401).send('Permission Denied');
    }
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(202).end();
});

router.delete('/', async (req, res) => {
  const {
    query: { dashboardID },
    user: { id: userID },
  } = req;
  let permissionObj;

  try {
    permissionObj = await getDashboardPermission(dashboardID, userID);

    // User is the owner of the dashboard
    if (permissionObj.role === 'Owner') {
      await deleteDashboardByID(dashboardID);
    } else {
      // User did not have sufficient permissions
      logger.error('Permission Denied');
      return res.status(401).send('Permission Denied');
    }
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(202).end();
});

module.exports = router;
