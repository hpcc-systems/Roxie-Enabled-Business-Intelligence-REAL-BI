const router = require('express').Router();
const {
  createChart,
  deleteChartByID,
  getChartsByDashboardID,
  updateChartByID,
} = require('../utils/chart');
const { createQueryParams, findAllQueryParams, updateQueryParam } = require('../utils/queryParam');

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
        chartParams = await findAllQueryParams(null, chart.id);
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
  const { chart, dashboardID, queryID } = req.body;
  let newChart, chartParams;

  try {
    newChart = await createChart(chart, dashboardID, queryID);

    await createQueryParams(queryID, chart, null, newChart.id);

    chartParams = await findAllQueryParams(null, newChart.id);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  // Add params array to new chart object
  newChart = { ...newChart, params: chartParams };

  return res.status(201).json(newChart);
});

router.put('/update', async (req, res) => {
  const { chart, dashboardID } = req.body;
  let charts, promises;

  try {
    await updateChartByID(chart);

    promises = chart.params.map(async ({ id, value }) => {
      return await updateQueryParam(id, value);
    });

    await Promise.all(promises);

    charts = await getChartsByDashboardID(dashboardID);
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Error' });
  }

  promises = charts.map(async chart => {
    let chartParams;

    try {
      chartParams = await findAllQueryParams(null, chart.id);
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
  const { chartID, dashboardID } = req.query;
  let charts;

  try {
    await deleteChartByID(chartID);
    charts = await getChartsByDashboardID(dashboardID);
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(202).json(charts);
});

module.exports = router;
