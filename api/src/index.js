const express = require('express');
const { sequelize } = require('./models');
const routes = require('./routes');
const logger = require('./config/logger');

// Passport Azure token validation setup
const passport = require('passport');

const bearerStrategy = require('./utils/passportStrategies/passport-azure');

const { PORT, NODE_PORT, REACT_APP_AUTH_METHOD } = process.env;
const port = PORT || NODE_PORT;

const app = express();

// Enable express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable passport middleware with Azure login flow
if (REACT_APP_AUTH_METHOD === 'ADFS') {
  app.use(passport.initialize());
  passport.use(bearerStrategy);
}

// Routes
app.use('/api', routes);

(async () => {
  try {
    await sequelize.authenticate();
    await app.listen(port);
  } catch (error) {
    return logger.error(error);
  }

  logger.info(`Server listening on port ${port}.`);
})();
