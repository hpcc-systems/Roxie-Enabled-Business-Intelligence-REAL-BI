const router = require('express').Router();
const { createChart, deleteChartByID, getChartsByDashboard } = require('../utils/chart');

// Get all charts for a given dashboard
router.get('/all', async (req, res) => {
  const { dashboardID } = req.query;
  let charts;

  try {
    charts = await getChartsByDashboard(dashboardID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json(charts);
});

// Create a new chart
router.post('/create', async (req, res) => {
  const { chart } = req.body;
  let newChart;

  try {
    newChart = await createChart(chart);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(201).json({ chartID: newChart.id });
});

router.delete('/delete', async (req, res) => {
  const { chartID } = req.query;

  try {
    await deleteChartByID(chartID);
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(202).end();
});

module.exports = router;
