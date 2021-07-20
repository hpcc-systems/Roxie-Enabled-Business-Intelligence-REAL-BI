const router = require('express').Router();
const passport = require('passport');
const { createUser } = require('../../utils/user');

router.get(
  '/loginAzure',
  passport.authenticate('oauth-bearer', {
    session: false,
  }),
  async (req, res, next) => {
    let user = req.user; // this user object came to us via passport middleware
    if (!user.id) {
      try {
        const [username] = req.authInfo.preferred_username.split('@');
        const email = req.authInfo.email;
        user = await createUser(email, username);
      } catch (error) {
        return next(error);
      }
    }
    res.send({ id: user.id, username: user.username, lastViewedWorkspace: user.lastViewedWorkspace });
  },
);

module.exports = router;
