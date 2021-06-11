const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const config = require('./passport-azure-config');
const logger = require('../../../config/logger');

const { user: User } = require('../../../models');

// this is the API scope you've exposed during app registration
// const EXPOSED_SCOPES = ['User.read'];

const options = {
  issuer: config.issuer,
  identityMetadata: config.identityMetadata,
  clientID: config.clientID,
  audience: config.audience,
  validateIssuer: config.validateIssuer,
  passReqToCallback: config.passReqToCallback,
  // loggingLevel: config.loggingLevel, // Uncomment for loggins in console.
  // scope: EXPOSED_SCOPES,
};

module.exports = new BearerStrategy(options, async (token, done) => {
  logger.info('User presented valid token');
  // When we verify token as middleware we need to create req.user because our routes rely on it
  try {
    // Get username from response
    const username = token.name;
    const dbUser = await User.findOne({ where: { username } });
    if (dbUser) {
      // Send user info using the second argument
      done(null, { id: dbUser.id, username }, token);
    } else {
      // If token was valid an no user was found it means user came from '/loginAzure' route, not hitting protected routes.
      done(null, {}, token);
    }
  } catch (error) {
    done(error);
  }
});
