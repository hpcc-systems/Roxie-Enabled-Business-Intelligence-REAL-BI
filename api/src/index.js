const express = require('express');
const { sequelize } = require('./models');
const routes = require('./routes');
const logger = require('./config/logger');

const { PORT, NODE_PORT } = process.env;
const port = PORT || NODE_PORT;

const app = express();

// Enable express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
