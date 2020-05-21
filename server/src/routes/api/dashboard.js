const router = require('express').Router();

// Utils
const { createDashboard, getDashboardByID } = require('../../utils/dashboard');

router.post('/create', async (req, res) => {
  const {
    body: { clusterID, name },
    user: { id: userID },
  } = req;
  let dashboard;

  try {
    dashboard = await createDashboard(clusterID, name, userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(201).json(dashboard);
});

router.get('/info', async (req, res) => {
  const { dashboardID } = req.query;
  let dashboard, params;

  try {
    dashboard = await getDashboardByID(dashboardID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json({ ...dashboard, params });
});

module.exports = router;
