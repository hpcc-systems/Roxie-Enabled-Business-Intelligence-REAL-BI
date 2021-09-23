const router = require('express').Router();

const axios = require('axios');

// Utils
const { getUserDetails } = require('../../utils/user');
const { validateChangePassword, validate } = require('../../utils/validation');

// Constants
const { AUTH_PORT, AUTH_URL } = process.env;

router.get('/get_data', async (req, res, next) => {
  try {
    const user = await getUserDetails(req.user.id);

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
});

router.post('/update_password', [validateChangePassword(), validate], async (req, res, next) => {
  const {
    body: { oldPwd, newPwd, newPwd2 },
    headers: { authorization },
    user: { username },
  } = req;

  try {
    await axios.post(
      `${AUTH_URL}:${AUTH_PORT}/api/users/changepwd`,
      { username, oldpassword: oldPwd, newpassword: newPwd, confirmpassword: newPwd2 },
      { headers: { authorization } },
    );

    res.status(200).json({ message: 'Password Updated' });
  } catch (err) {
    res.status(err?.response?.status || 500);
    const error = new Error(err?.response?.data?.errors);
    return next(error);
  }
});

module.exports = router;
