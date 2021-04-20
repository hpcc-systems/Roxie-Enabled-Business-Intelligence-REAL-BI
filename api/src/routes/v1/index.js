const router = require('express').Router();
const { authenticateToken } = require('../middleware');

const auth = require('./auth');
const chart = require('./chart');
const cluster = require('./cluster');
const clusterCredentials = require('./clusterCredentials');
const dashboard = require('./dashboard');
const dashboardFilter = require('./dashboardFilter');
const dashboardRelation = require('./dashboardRelation');
const hpcc = require('./hpcc');
const keys = require('./keys');
const share = require('./share');
const source = require('./source');
const user = require('./user');
const workspace = require('./workspace');
const workspaceDirectory = require('./workspaceDirectory');

// Open Routes
router.use('/auth', auth);

// Authenticate token before proceeding to route
router.use(authenticateToken);

// Authenticated routes
router.use('/chart', chart);
router.use('/cluster', cluster);
router.use('/cluster_credentials', clusterCredentials);
router.use('/dashboard', dashboard);
router.use('/dashboard_filter', dashboardFilter);
router.use('/dashboard_relation', dashboardRelation);
router.use('/hpcc', hpcc);
router.use('/keys', keys);
router.use('/share', share);
router.use('/source', source);
router.use('/user', user);
router.use('/workspace', workspace);
router.use('/workspace_directory', workspaceDirectory);

module.exports = router;
