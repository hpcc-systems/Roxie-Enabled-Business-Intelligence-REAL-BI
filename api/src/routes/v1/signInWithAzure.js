const router = require('express').Router();
const passport = require('passport');
const { createUser, getUserByEmail } = require('../../utils/user');

router.get(
  '/loginAzure',
  passport.authenticate('oauth-bearer', {
    session: false,
  }),
  async (req, res, next) => {
    const email = req.authInfo.preferred_username;
    const username = req.authInfo.name;
    // Getting user from DB if not exist then creat and return to front
    try {
      let user = await getUserByEmail(email);
      if (!user) {
        user = await createUser(email, username);
      }
      res.send({ id: user.id, username, lastViewedWorkspace: user.lastViewedWorkspace });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
