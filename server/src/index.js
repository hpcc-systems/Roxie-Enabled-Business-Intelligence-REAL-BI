const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const { auth, chart, cluster, clusterAuth, dashboard, dashboardParam, source, user } = require('./routes');
const { authenticateToken } = require('./routes/middleware');

const { PORT, NODE_PORT } = process.env;
const port = PORT || NODE_PORT;

const app = express();

// Enable middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.options('*', cors());

// Routes
app.use('/api/auth', auth);
app.use('/api/chart', authenticateToken(), chart);
app.use('/api/cluster', authenticateToken(), cluster);
app.use('/api/clusterauth', authenticateToken(), clusterAuth);
app.use('/api/dashboard', authenticateToken(), dashboard);
app.use('/api/dashboardparam', authenticateToken(), dashboardParam);
app.use('/api/source', authenticateToken(), source);
app.use('/api/user', authenticateToken(), user);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => console.log(`Server listening on port ${port}.`));
  })
  .catch(err => console.error(err));
