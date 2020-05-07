const router = require('express').Router();
const {
  createChart,
  deleteChartByID,
  getChartOwnerByID,
  getChartsByDashboardAndQueryID,
  getChartsByDashboardID,
  updateChartByID,
} = require('../../utils/chart');
const { deleteDashboardSource } = require('../../utils/dashboardSource');
const { deleteQueryByID } = require('../../utils/query');
const { createChartParams, findAllChartParams, updateChartParam } = require('../../utils/chartParam');

router.get('/all', async (req, res) => {
  const { dashboardID } = req.query;
  let charts;

  try {
    charts = await getChartsByDashboardID(dashboardID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  // Loop through and add params to each chart
  if (charts.length > 0) {
    const promises = charts.map(async chart => {
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
      console.error(err);
      return res.status(500).json({ msg: 'Internal Error' });
    }
  }

  return res.status(200).json(charts);
});

router.post('/create', async (req, res) => {
  const {
    body: { chart, dashboardID, queryID },
    user: { id: userID },
  } = req;
  let newChart, chartParams;

  try {
    newChart = await createChart(chart, dashboardID, queryID, userID);

    await createChartParams(queryID, chart, newChart.id);

    chartParams = await findAllChartParams(newChart.id);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  // Add params array to new chart object
  newChart = { ...newChart, params: chartParams };

  return res.status(201).json(newChart);
});

router.put('/update', async (req, res) => {
  const {
    body: { chart, dashboardID },
    user: { id: userID },
  } = req;
  let dbChart, charts, promises;

  try {
    dbChart = await getChartOwnerByID(chart.id, userID);

    // User is the owner of the chart
    if (Object.keys(dbChart).length > 0) {
      await updateChartByID(chart);

      promises = chart.params.map(async ({ id, value }) => {
        return await updateChartParam(id, value);
      });

      await Promise.all(promises);
    }

    charts = await getChartsByDashboardID(dashboardID);
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Error' });
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
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(202).json(charts);
});

router.delete('/delete', async (req, res) => {
  const {
    query: { chartID, dashboardID, queryID },
    user: { id: userID },
  } = req;
  let chart, charts, numOfCharts;

  try {
    chart = await getChartOwnerByID(chartID, userID);

    // User is the owner of the chart
    if (Object.keys(chart).length > 0) {
      await deleteChartByID(chartID);

      // Determine if any other charts in the application are using the same query
      numOfCharts = await getChartsByDashboardAndQueryID(null, queryID);

      // No other charts in the application are using the same query
      if (numOfCharts === 0) {
        await deleteQueryByID(queryID);
      } else {
        // Determine if any other charts on the same dashboard are using the same query
        numOfCharts = await getChartsByDashboardAndQueryID(dashboardID, queryID);

        // No other charts on the dashboard are using the same query
        if (numOfCharts === 0) {
          // Delete dashboard Source and 'Dashboard Level' params
          await deleteDashboardSource(dashboardID, queryID);
        }
      }
    }

    charts = await getChartsByDashboardID(dashboardID);
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(202).json(charts);
});

module.exports = router;
