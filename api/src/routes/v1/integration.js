const { findOrCreateCluster } = require('../../utils/cluster');
const { findOrCreateDashboard } = require('../../utils/dashboard');

const { addDashboardAsOpenDashboad } = require('../../utils/openDashboards');
const { getUserByEmail } = require('../../utils/user');
const { findOrCreatePublicWorkspace } = require('../../utils/workspace');
const { updateOrCreateWorkspaceDirectory } = require('../../utils/workspaceDirectory');

const SHARE_URL = process.env.SHARE_URL;

const router = require('express').Router();

router.post('/', async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.user.email);
    const workspace = await findOrCreatePublicWorkspace(user.id, req.body.workspaceName);
    const cluster = await findOrCreateCluster(req.body.cluster);
    const dashboard = await findOrCreateDashboard(workspace.id, cluster.id, user.id, req.body.dashboardName);
    await addDashboardAsOpenDashboad(dashboard.id, workspace.id, user.id);
    await updateOrCreateWorkspaceDirectory(dashboard, workspace.id); // this one is for directories to appear in drawer

    const url = SHARE_URL || 'http://localhost:3000';
    const link = `${url}/workspace/${workspace.id}/${dashboard.id}/${req.body.filename}/`;
    return res.status(200).send({ workspaceUrl: link });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
