const express = require('express');
const { sequelize } = require('./models');
const { auth, chart, cluster, clusterAuth, dashboard, source, user, workspace } = require('./routes');
const { authenticateToken } = require('./routes/middleware');
const logger = require('./config/logger');

const { PORT, NODE_PORT } = process.env;
const port = PORT || NODE_PORT;

const app = express();

// Enable middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/auth', auth);
app.use('/api/chart', authenticateToken(), chart);
app.use('/api/cluster', authenticateToken(), cluster);
app.use('/api/clusterauth', authenticateToken(), clusterAuth);
app.use('/api/dashboard', authenticateToken(), dashboard);
app.use('/api/source', authenticateToken(), source);
app.use('/api/user', authenticateToken(), user);
app.use('/api/workspace', authenticateToken(), workspace);

sequelize
  .authenticate()
  .then(() => {
    app.listen(port, () => logger.info(`Server listening on port ${port}.`));
  })
  .catch(err => logger.error(`Error connecting to DB -> ${err}.`));
