const router = require('express').Router();
const logger = require('../../config/logger');

// Utils
const {
  createDashboard,
  deleteDashboardByID,
  getDashboardByID,
  getDashboardFilterSourceInfo,
  updateDashboardByID,
} = require('../../utils/dashboard');
const { createDashboardPermission, getDashboardPermission } = require('../../utils/dashboardPermission');
const errHandler = require('../../utils/errHandler');

// Constants
const { directoryObjNameRegexp } = require('../../constants');

router.post('/', async (req, res) => {
  const {
    body: { dashboard, workspaceID },
    user: { id: userID },
  } = req;
  let newDashboard;

  // Make sure dashboard name conforms to required regexp
  if (!directoryObjNameRegexp.test(dashboard.name)) {
    const errMsg = `"${name}" is not a valid dashboard name`;
    logger.error(errMsg);

    return res.status(400).send(errMsg);
  }

  try {
    newDashboard = await createDashboard(dashboard, workspaceID, userID);
    await createDashboardPermission(newDashboard.id, userID, 'Owner');
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(201).json(newDashboard);
});

router.get('/info', async (req, res) => {
  const {
    query: { dashboardID },
    user: { id: userID },
  } = req;
  let dashboard, permissionObj;

  try {
    dashboard = await getDashboardByID(dashboardID);

    if (dashboard.filters) {
      const promises = dashboard.filters.map(async (filter, index) => {
        const newFilter = await getDashboardFilterSourceInfo(filter);
        dashboard.filters[index] = newFilter;
      });

      await Promise.all(promises);
    }

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
  const { id, name } = body;
  let permissionObj;

  // Make sure dashboard name conforms to required regexp
  if (!directoryObjNameRegexp.test(name)) {
    const errMsg = `"${name}" is not a valid dashboard name`;
    logger.error(errMsg);

    return res.status(400).send(errMsg);
  }

  try {
    permissionObj = await getDashboardPermission(id, userID);

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
