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
const { deleteSourceByID } = require('../../utils/source');
const { getDashboardParamsByDashboardAndSourceID } = require('../../utils/dashboardParam');
const { getDashboardPermission } = require('../../utils/dashboardPermission');
const { createChartParams, findAllChartParams, updateChartParam } = require('../../utils/chartParam');
const logger = require('../../config/logger');
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

  // Loop through and add params to each chart
  if (charts.length > 0) {
    const promises = charts.map(async chart => {
      let chartParams;

      try {
        chartParams = await findAllChartParams(chart.id);
      } catch (err) {
        return logger.error(err);
      }

      return { ...chart, params: chartParams };
    });

    // Wait for promises to complete and update charts variable
    try {
      charts = await Promise.all(promises);
    } catch (err) {
      const { errMsg, status } = errHandler(err);
      return res.status(status).send(errMsg);
    }
  }

  return res.status(200).json(charts);
});

router.post('/create', async (req, res) => {
  const {
    body: { chart, dashboardID, sourceID },
    user: { id: userID },
  } = req;
  let newChart, chartParams;

  try {
    newChart = await createChart(chart, dashboardID, sourceID, userID);

    await createChartParams(sourceID, chart, newChart.id);

    chartParams = await findAllChartParams(newChart.id);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  // Add params array to new chart object
  newChart = { ...newChart, params: chartParams };

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
    body: { chart, dashboardID },
    user: { id: userID },
  } = req;
  let charts, promises, permissionObj;

  try {
    permissionObj = await getDashboardPermission(dashboardID, userID);

    // User is the owner of the chart
    if (permissionObj.role === 'Owner') {
      await updateChartByID(chart);

      promises = chart.params.map(async ({ id, value }) => {
        return await updateChartParam(id, value);
      });

      await Promise.all(promises);
    }

    charts = await getChartsByDashboardID(dashboardID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  promises = charts.map(async chart => {
    let chartParams;

    try {
      chartParams = await findAllChartParams(chart.id);
    } catch (err) {
      return console.error(err);
    }

    return { ...chart, params: chartParams };
  });

  // Wait for promises to complete and update charts variable
  try {
    charts = await Promise.all(promises);
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

      // Determine if any other charts or filters in the application are using the same source
      numOfCharts = await getChartsByDashboardAndSourceID(null, sourceID);
      paramsArr = await getDashboardParamsByDashboardAndSourceID(null, sourceID);

      // No other charts or dashboard filters in the application are using the same source
      if (numOfCharts === 0 && paramsArr === 0) {
        await deleteSourceByID(sourceID);
      } else {
        // Determine if any other charts or filters on the same dashboard are using the same source
        numOfCharts = await getChartsByDashboardAndSourceID(dashboardID, sourceID);
        paramsArr = await getDashboardParamsByDashboardAndSourceID(dashboardID, sourceID);

        // No other charts or filters on the dashboard are using the same source
        if (numOfCharts === 0 && paramsArr === 0) {
          // Delete dashboard Source and 'Dashboard Level' params
          await deleteDashboardSource(dashboardID, sourceID);
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
