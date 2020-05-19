const auth = require('./api/auth');
const chart = require('./api/chart');
const chartParam = require('./api/chartParam');
const cluster = require('./api/cluster');
const clusterAuth = require('./api/clusterAuth');
const dashboard = require('./api/dashboard');
const dashboardParam = require('./api/dashboardParam');
const query = require('./api/query');
const userSettings = require('./api/userSettings');

module.exports = {
  auth,
  chart,
  chartParam,
  cluster,
  clusterAuth,
  dashboard,
  dashboardParam,
  query,
  userSettings,
};
