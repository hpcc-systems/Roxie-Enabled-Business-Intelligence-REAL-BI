const router = require('express').Router();

// Utils
const {
  createDashboard,
  deleteDashboardByID,
  getDashboardByID,
  updateDashboardByID,
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
    await updateDashboardByID(clusterID, dashboardID, name);
    const dashboard = await getDashboardByID(dashboardID, userID);
    return res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    await deleteDashboardByID(req.query.dashboardID);
    return res.status(200).end();
  } catch (error) {
    next(error);
  }
});

router.delete('/multiple', async (req, res, next) => {
  const { dashboardIDArray = [] } = req.query;

  try {
    const promises = dashboardIDArray.map(dashboardID => deleteDashboardByID(dashboardID));
    await Promise.all(promises);

    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
