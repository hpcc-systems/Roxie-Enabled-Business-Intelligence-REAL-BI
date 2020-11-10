const router = require('express').Router();

// Utils
const { createSource, getSourceByHpccID } = require('../../utils/source');
const { validate, validateSourceCreation } = require('../../utils/validation');

router.post('/', [validateSourceCreation(), validate], async (req, res, next) => {
  try {
    let dbSource;
    dbSource = await getSourceByHpccID(req.body.source.hpccID);
    res.status(200);

    if (!dbSource) {
      dbSource = await createSource(req.body.source);
      res.status(201);
    }

    return res.json(dbSource);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
