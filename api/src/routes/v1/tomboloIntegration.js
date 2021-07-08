const router = require('express').Router();

router.post('/', async (req, res, next) => {
  console.log(`-------------------------------`);
  console.log('helllo world');
  console.log(`-------------------------------`);
  res.end();
});

module.exports = router;
