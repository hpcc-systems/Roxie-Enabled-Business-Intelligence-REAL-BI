const router = require('express').Router();
const { createDashboard, getDashboardByID, getDashboardsByUser } = require('../utils/dashboard');

// Get all dashboards
router.get('/all', async (req, res) => {
  const { id: userID } = req.user;
  let dashboards;

  try {
    dashboards = await getDashboardsByUser(userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  res.status(200).json(dashboards);
});

// Create a new dashboard
router.post('/create', async (req, res) => {
  const { clusterID, name } = req.body;
  const { id: userID } = req.user;
  let dashboards;

  try {
    await createDashboard(clusterID, name, userID);
    dashboards = await getDashboardsByUser(userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(201).json(dashboards);
});

// Get information about a single dashboard
router.get('/info', async (req, res) => {
  const { dashboardID } = req.query;
  let dashboard;

  try {
    dashboard = await getDashboardByID(dashboardID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json(dashboard);
});

module.exports = router;
