const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const config = require('./passport-azure-config');
const logger = require('../../../config/logger');

const { user: User } = require('../../../models');

const options = {
  issuer: config.issuer,
  identityMetadata: config.identityMetadata,
  clientID: config.clientID,
  audience: config.audience,
  validateIssuer: config.validateIssuer,
  passReqToCallback: config.passReqToCallback,
  // loggingLevel: config.loggingLevel, // Uncomment for loggins in console.
  // loggingNoPII: false,
  scope: config.scope,
};

if (process.env.REACT_APP_AUTH_METHOD === 'ADFS') {
  module.exports = new BearerStrategy(options, async (token, done) => {
    logger.info('User presented valid token');
    // console.log('-token-----------------------------------------');
    // console.dir({ token }, { depth: null });
    // console.log('------------------------------------------');
    // When we verify token as middleware we need to create req.user because our routes rely on it
    try {
      const email = token.email;
      const dbUser = await User.findOne({ where: { email } });
      if (dbUser) {
        done(
          null,
          {
            id: dbUser.id,
            username: dbUser.username,
            email: dbUser.email,
            lastViewedWorkspace: dbUser.lastViewedWorkspace,
          },
          token,
        ); // Send user info using the sevi cond argument
      } else {
        done(null, {}, token); // If token was valid an no user was found it means user came from '/loginAzure' route, not hitting protected routes.
      }
    } catch (error) {
      done(error);
    }
  });
}
