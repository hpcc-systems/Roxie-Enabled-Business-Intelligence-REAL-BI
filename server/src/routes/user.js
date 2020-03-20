const router = require('express').Router();

// Utils
const { getUserDirectory } = require('../utils/user');

router.get('/directory', async (req, res) => {
  const { id: userID } = req.user;
  let user;

  try {
    user = await getUserDirectory(userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  const { directory } = user;

  return res.status(200).json(directory);
});

module.exports = router;
