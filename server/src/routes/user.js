const router = require('express').Router();

// Utils
const { getUserDirectory, updateUserDirectory } = require('../utils/user');

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

router.put('/updatedirectory', async (req, res) => {
  const {
    body: { directory },
    user: { id: userID },
  } = req;

  try {
    await updateUserDirectory(directory, userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(202).end();
});

module.exports = router;
