const router = require('express').Router();
const {
  createChart,
  deleteChartByID,
  getChartsByDashboardAndSourceID,
  getChartsByDashboardID,
  updateChartByID,
  shareChart,
} = require('../../utils/chart');
const { deleteDashboardSource } = require('../../utils/dashboardSource');
const { updateSourceByID, deleteSourceByID } = require('../../utils/source');
const { getDashboardPermission } = require('../../utils/dashboardPermission');
const errHandler = require('../../utils/errHandler');

router.get('/all', async (req, res) => {
  const { dashboardID } = req.query;
  let charts;

  try {
    charts = await getChartsByDashboardID(dashboardID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(200).json(charts);
});

router.post('/create', async (req, res) => {
  const {
    body: { chart, dashboardID, sourceID },
    user: { id: userID },
  } = req;
  let newChart;

  try {
    newChart = await createChart(chart, dashboardID, sourceID, userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(201).json(newChart);
});

router.post('/share', async (req, res) => {
  const { email, dashboardID } = req.body;

  try {
    await shareChart(email, dashboardID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(200).end();
});

router.put('/update', async (req, res) => {
  const {
    body: { chart, dashboardID, sourceID, sourceType },
    user: { id: userID },
  } = req;
  let charts, permissionObj;

  try {
    permissionObj = await getDashboardPermission(dashboardID, userID);

    // User is the owner of the chart
    if (permissionObj.role === 'Owner') {
      if (sourceType === 'ecl') {
        const { workunitID } = chart.ecl;

        await updateSourceByID(sourceID, { hpccID: workunitID, name: workunitID });
      }

      await updateChartByID(chart);
    }

    charts = await getChartsByDashboardID(dashboardID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(202).json(charts);
});

router.delete('/delete', async (req, res) => {
  const {
    query: { chartID, dashboardID, sourceID },
    user: { id: userID },
  } = req;
  let charts, numOfCharts, paramsArr, permissionObj;

  try {
    permissionObj = await getDashboardPermission(dashboardID, userID);

    // User is the owner of the chart
    if (permissionObj.role === 'Owner') {
      await deleteChartByID(chartID);

      // If not a static text widget
      if (sourceID) {
        // Determine if any other charts in the application are using the same source
        numOfCharts = await getChartsByDashboardAndSourceID(null, sourceID);

        // No other charts or dashboard filters in the application are using the same source
        if (numOfCharts === 0 && paramsArr === 0) {
          await deleteSourceByID(sourceID);
        } else {
          // Determine if any other charts on the same dashboard are using the same source
          numOfCharts = await getChartsByDashboardAndSourceID(dashboardID, sourceID);

          // No other charts on the dashboard are using the same source
          if (numOfCharts === 0 && paramsArr === 0) {
            // Delete dashboard Source and 'Dashboard Level' params
            await deleteDashboardSource(dashboardID, sourceID);
          }
        }
      }
    }

    charts = await getChartsByDashboardID(dashboardID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  return res.status(202).json(charts);
});

module.exports = router;
