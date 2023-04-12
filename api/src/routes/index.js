const router = require('express').Router();
const v1 = require('./v1');
const { logRequest, notFound, errorHandler } = require('./middleware');

// Log the request
router.use(logRequest);

router.use('/v1', v1);

// Enable middleware for undefined routes and error handler
router.use(notFound);
router.use(errorHandler);

module.exports = router;
