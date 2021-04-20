const router = require('express').Router();

router.get('/map_key', (req, res, next) => {
  const { MAPBOX_ACCESS_TOKEN } = process.env;

  if (!MAPBOX_ACCESS_TOKEN) {
    const error = new Error('No Mapbox API key found');
    return next(error);
  }

  res.status(200).json({ key: MAPBOX_ACCESS_TOKEN });
});

module.exports = router;
