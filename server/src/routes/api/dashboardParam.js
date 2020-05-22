const router = require('express').Router();

// Utils
const {
  createDashboardParam,
  deleteDashboardParam,
  getDashboardParams,
  updateDashboardParam,
} = require('../../utils/dashboardParam');

router.get('/all', async (req, res) => {
  const {
    query: { dashboardID },
    user: { id: userID },
  } = req;
  let params;

  try {
    params = await getDashboardParams(dashboardID, userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json(params);
});

router.post('/create', async (req, res) => {
  const {
    body: { paramObj },
    user: { id: userID },
  } = req;
  let params;

  try {
    await createDashboardParam(paramObj, userID);
    params = await getDashboardParams(paramObj.dashboardID, userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(201).json(params);
});

router.put('/update', async (req, res) => {
  const {
    body: { paramObj },
    user: { id: userID },
  } = req;
  let params;

  try {
    await updateDashboardParam(paramObj);
    params = await getDashboardParams(paramObj.dashboardID, userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(202).json(params);
});

router.delete('/delete', async (req, res) => {
  const {
    query: { dashboardID, filterID },
    user: { id: userID },
  } = req;
  let params;

  try {
    await deleteDashboardParam(filterID);
    params = await getDashboardParams(dashboardID, userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(202).json(params);
});

module.exports = router;
