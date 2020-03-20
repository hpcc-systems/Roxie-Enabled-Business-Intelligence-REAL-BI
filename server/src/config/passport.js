const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { user: userModel } = require('../models');

// Utils
const { unNestSequelizeObj } = require('../utils/misc');

const { JWT_SECRET } = process.env;

const jwtParams = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  session: false,
};

const jwtStrategy = new Strategy(jwtParams, async ({ id }, done) => {
  let user;

  try {
    // Find user by ID
    user = await userModel.findByPk(id);
  } catch (err) {
    console.error(err);
    return done(err, false);
  }

  // No user found
  if (!user) {
    return done(null, false);
  }

  // Un-nest user object
  user = unNestSequelizeObj(user);

  return done(null, user);
});

module.exports = {
  initialize: () => passport.initialize(),
  jwtStrategy: () => passport.use(jwtStrategy),
  authenticate: () => passport.authenticate('jwt', { session: false }),
};
