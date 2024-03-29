const { findOrCreateCluster } = require('../../utils/cluster');
const { findOrCreateDashboard } = require('../../utils/dashboard');

const { addDashboardAsOpenDashboard } = require('../../utils/openDashboards');
const { createUser } = require('../../utils/user');
const { findOrCreatePublicWorkspace } = require('../../utils/workspace');
const { updateOrCreateWorkspaceDirectory } = require('../../utils/workspaceDirectory');

const SHARE_URL = process.env.SHARE_URL;

const router = require('express').Router();

router.post('/', async (req, res, next) => {
  const userRole = req.body.editingAllowed ? 'Owner' : 'Read-Only';
  const file = req.body?.filename ? req.body.filename.trim() : null;
  const clusterFromRequest = req.body.cluster || null;
  const dashboardNameFromRequest = req.body.dashboardName.trim();

  const checkDashNameExists = (workspace, dashboardName) => {
    if (workspace?.dashboards?.length > 0) {
      const duplicateDash = workspace.dashboards.find(dash => dash.name === dashboardName);
      if (duplicateDash) {
        const link = `${SHARE_URL || 'http://localhost:3000'}/workspace/${workspace.id}/${duplicateDash.id}`;
        return {
          success: false,
          message: `Dashboard with name "${duplicateDash.name}" already exists, please provide a different name.`,
          workspaceUrl: link,
        };
      }
    }
    return null;
  };

  try {
    const user = req.user ? req.user : await createUser(req.token.email, req.token.username);
    const workspace = await findOrCreatePublicWorkspace(user.id, req.body.workspaceName.trim(), userRole);
    const cluster = clusterFromRequest ? await findOrCreateCluster(clusterFromRequest) : null;

    if (!cluster) {
      const result = checkDashNameExists(workspace, dashboardNameFromRequest);
      if (result) {
        return res.send(result);
      }
    }

    const dashboard = await findOrCreateDashboard(
      workspace.id,
      cluster?.id || null,
      user.id,
      dashboardNameFromRequest,
      file,
      userRole,
    );
    await addDashboardAsOpenDashboard(dashboard.id, workspace.id, user.id);
    await updateOrCreateWorkspaceDirectory(dashboard, workspace.id); // this one is for directories to appear in drawer

    const url = SHARE_URL || 'http://localhost:3000';
    const link = `${url}/workspace/${workspace.id}/${dashboard.id}/${file || ''}`;
    return res.status(200).send({ workspaceUrl: link });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
