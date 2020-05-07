const router = require('express').Router();

const { findAllChartParams, updateChartParam } = require('../../utils/chartParam');

router.get('/all', async (req, res) => {
  const { chartID } = req.query;
  let params;

  try {
    params = await findAllChartParams(chartID);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal Error' });
  }

  res.status(202).json(params);
});

router.put('/update', async (req, res) => {
  const { chartID, paramID, value } = req.body;
  let params;

  try {
    await updateChartParam(paramID, value);
    params = await findAllChartParams(chartID);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal Error' });
  }

  res.status(202).json(params);
});

module.exports = router;
