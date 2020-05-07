const router = require('express').Router();

// Utils
const {
  createDashboardParam,
  getDashboardParams,
  updateDashboardParam,
} = require('../../utils/dashboardParam');

router.get('/all', async (req, res) => {
  const { dashboardID } = req.query;
  let params;

  try {
    params = await getDashboardParams(dashboardID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json(params);
});

router.post('/create', async (req, res) => {
  const { paramObj } = req.body;
  let params;

  try {
    await createDashboardParam(paramObj);
    params = await getDashboardParams(paramObj.dashboardID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(201).json(params);
});

router.put('/update', async (req, res) => {
  const { paramObj } = req.body;
  let params;

  try {
    await updateDashboardParam(paramObj);
    params = await getDashboardParams(paramObj.dashboardID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(202).json(params);
});

module.exports = router;
