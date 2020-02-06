const router = require('express').Router();
const { createChart } = require('../utils/chart');

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

module.exports = router;
