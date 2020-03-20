const router = require('express').Router();
const jwt = require('jsonwebtoken');

// Utils
const { getUserByID } = require('../utils/auth');

// Environment variables
const { JWT_SECRET } = process.env;

router.post('/login', async (req, res) => {
  const { userID } = req.body;
  let user;

  try {
    user = await getUserByID(userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  // No user found
  if (!user) {
    return res.status(500).json({ msg: 'No user found' });
  }

  // Create and Sign JWT token
  return jwt.sign(user, JWT_SECRET, {}, (err, token) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Internal Error' });
    }

    res.status(200).json({ jwt: `Bearer ${token}` });
  });
});

module.exports = router;
