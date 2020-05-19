const path = require('path');

// Load .env file
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const express = require('express');
const { sequelize } = require('./models');
const {
  auth,
  chart,
  cluster,
  clusterAuth,
  dashboard,
  dashboardParam,
  query,
  userSettings,
} = require('./routes');
const { authenticateToken } = require('./routes/middleware');

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
app.use('/api/dashboardparam', authenticateToken(), dashboardParam);
app.use('/api/query', authenticateToken(), query);
app.use('/api/usersettings', authenticateToken(), userSettings);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => console.log(`Server listening on port ${port}.`));
  })
  .catch(err => console.error(err));
