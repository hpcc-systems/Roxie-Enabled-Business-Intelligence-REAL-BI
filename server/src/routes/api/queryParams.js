const router = require('express').Router();

const { findAllQueryParams, updateQueryParam } = require('../../utils/queryParam');

router.get('/all', async (req, res) => {
  const { chartID, dashboardID } = req.query;
  let params;

  try {
    params = await findAllQueryParams(dashboardID, chartID);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal Error' });
  }

  res.status(202).json(params);
});

router.put('/update', async (req, res) => {
  const { chartID, dashboardID, paramID, value } = req.body;
  let params;

  try {
    await updateQueryParam(paramID, value);
    params = await findAllQueryParams(dashboardID, chartID);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal Error' });
  }

  res.status(202).json(params);
});

module.exports = router;
