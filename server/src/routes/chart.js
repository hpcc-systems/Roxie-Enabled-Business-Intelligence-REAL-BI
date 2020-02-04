const router = require('express').Router();
const { createChart } = require('../utils/chart');

// Create a new chart
router.post('/create', async (req, res) => {
  const { chartObj } = req.body;

  console.log(chartObj);

  try {
    await createChart(chartObj);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(201).end();
});

module.exports = router;
