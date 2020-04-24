const auth = require('./api/auth');
const chart = require('./api/chart');
const cluster = require('./api/cluster');
const clusterAuth = require('./api/clusterAuth');
const dashboard = require('./api/dashboard');
const query = require('./api/query');
const queryParam = require('./api/queryParams');
const user = require('./api/user');

module.exports = { auth, chart, cluster, clusterAuth, dashboard, query, queryParam, user };
