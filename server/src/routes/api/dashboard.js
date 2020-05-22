const router = require('express').Router();

// Utils
const { createDashboard, getDashboardByID } = require('../../utils/dashboard');
const { createDashboardPermission, getDashboardPermission } = require('../../utils/dashboardPermission');

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
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
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
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json({ ...dashboard, role: permissionObj.role });
});

module.exports = router;
