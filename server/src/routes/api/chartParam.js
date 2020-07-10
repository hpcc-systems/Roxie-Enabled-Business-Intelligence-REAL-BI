const router = require('express').Router();
const errHandler = require('../../utils/errHandler');

const { findAllChartParams, updateChartParam } = require('../../utils/chartParam');

router.get('/all', async (req, res) => {
  const { chartID } = req.query;
  let params;

  try {
    params = await findAllChartParams(chartID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
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
    const { errMsg, status } = errHandler(err);
    return res.status(status).send(errMsg);
  }

  res.status(202).json(params);
});

module.exports = router;
