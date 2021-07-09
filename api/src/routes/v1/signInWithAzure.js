const router = require('express').Router();
const passport = require('passport');
const { createUser } = require('../../utils/user');
const axios = require('axios');

router.post(
  '/loginAzure',
  passport.authenticate('oauth-bearer', {
    session: false,
  }),
  async (req, res, next) => {
    let user = req.user; // this user object came to us via passport middleware
    if (!user) {
      try {
        const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
          headers: { Authorization: `Bearer ${req.body.accessToken}` },
        });
        const azureUser = response.data;
        const [username] = azureUser.userPrincipalName.split('@');
        user = await createUser(azureUser.mail, username);
      } catch (error) {
        next(error);
      }
    }
    res.send({ id: user.id, username: user.username, lastViewedWorkspace: user.lastViewedWorkspace });
  },
);

module.exports = router;
