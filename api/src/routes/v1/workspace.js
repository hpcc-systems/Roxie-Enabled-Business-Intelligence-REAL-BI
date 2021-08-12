const router = require('express').Router();

const { getDashboardsByWorkspaceID } = require('../../utils/dashboard');
const { changeDashboardsPermissionByWorkspaceID } = require('../../utils/dashboardPermission');
const {
  getOpenDashboardsByUser,
  createOpenDashboard,
  getOpenDashboard,
  restoreOpenDashboard,
  deleteOpenDashboard,
  addDashboardAsOpenDashboad,
} = require('../../utils/openDashboards');
const { updateLastViewedWorkspace } = require('../../utils/user');
const {
  createWorkspace,
  updateWorkspaceByID,
  deleteWorkspaceByID,
  getWorkspacesByUserID,
  getWorkspaceByID,
  getWorkspaceFromDB,
} = require('../../utils/workspace');

const {
  createWorkspacePermission,
  deleteWorkspacePermission,
  createOrUpdateWorkspacePermission,
  isWorkspacePermissionRole,
} = require('../../utils/workspacePermission');

router.get('/all', async (req, res, next) => {
  try {
    const workspaces = await getWorkspacesByUserID(req.user.id);

    return res.status(200).send(workspaces);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  const {
    body: { name },
    user: { id: userID },
  } = req;

  try {
    const workspace = await createWorkspace(name, userID);
    await createWorkspacePermission(workspace.id, userID, 'Owner');
    const workspaces = await getWorkspacesByUserID(userID);

    return res.status(201).send({ workspaces, workspaceID: workspace.id });
  } catch (error) {
    return next(error);
  }
});

router.put('/', async (req, res, next) => {
  const {
    body: { workspaceName, publicWorkspace, workspaceID },
    user: { id: userID },
  } = req;

  try {
    const { permission = 'Read-Only' } = await getWorkspaceByID(workspaceID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }
    const updates = { name: workspaceName, visibility: publicWorkspace ? 'public' : 'private' };
    await updateWorkspaceByID(updates, workspaceID);
    const currentWorkspace = await getWorkspaceByID(workspaceID, userID); //gets big object
    const workspaces = await getWorkspacesByUserID(userID);

    return res.status(200).send({ workspaces, currentWorkspace });
  } catch (error) {
    return next(error);
  }
});

router.delete('/', async (req, res, next) => {
  const {
    query: { workspaceID },
    user: { id: userID },
  } = req;

  try {
    const { permission = 'Read-Only', visibility } = await getWorkspaceByID(workspaceID, userID);

    if (permission !== 'Owner' && visibility !== 'public') {
      const error = new Error('Permission Denied');
      throw error;
    }
    // if it was public workspace we want to delete only permission to use this workspace, it will delete record from dropdown and user wont have access to it
    if (visibility === 'public') {
      await changeDashboardsPermissionByWorkspaceID(workspaceID, userID, 'Read-Only');
      await deleteWorkspacePermission(workspaceID, userID);
    } else {
      await deleteWorkspaceByID(workspaceID);
    }

    const workspaces = await getWorkspacesByUserID(userID);

    return res.status(200).send(workspaces);
  } catch (error) {
    next(error);
  }
});

router.put('/last', async (req, res, next) => {
  const {
    body: { workspaceID },
    user: { id: userID },
  } = req;

  try {
    await updateLastViewedWorkspace(workspaceID, userID);

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

router.get('/find', async (req, res, next) => {
  const {
    query: { workspaceID, dashID },
    user: { id: userID },
  } = req;

  try {
    let workspace = await getWorkspaceFromDB({ id: workspaceID, visibility: 'public' }); //Check if public
    if (workspace) {
      //if user if OWNER dont change his pemission
      const isOwner = await isWorkspacePermissionRole(workspaceID, userID, 'Owner');
      if (!isOwner) {
        await createOrUpdateWorkspacePermission(workspace.id, userID, 'Read-only'); // this will add workspace to dropdown and allow you to delete your permission but not workspace itself
      }
      //1. check if dashboard exists in workspace
      const dashboards = await getDashboardsByWorkspaceID(workspaceID);

      const currentDash = dashboards && dashboards.find(dash => dash.id === dashID);
      //2. add dashboard to openDashboard
      if (currentDash) await addDashboardAsOpenDashboad(dashID, workspaceID, userID);
    }

    workspace = await getWorkspaceByID(workspaceID, userID);
    await updateLastViewedWorkspace(workspaceID, userID);
    const workspaces = await getWorkspacesByUserID(userID); //this is to populate dropdown with workspaces on top of the page
    return res.status(200).json({ workspace, workspaces });
  } catch (err) {
    return next(err);
  }
});

router.get('/open_dashboard', async (req, res, next) => {
  const {
    query: { workspaceID },
    user: { id: userID },
  } = req;

  try {
    const openDashboards = await getOpenDashboardsByUser(workspaceID, userID);
    return res.json(openDashboards);
  } catch (err) {
    return next(err);
  }
});

router.post('/open_dashboard', async (req, res, next) => {
  const {
    body: { dashboardID, workspaceID },
    user: { id: userID },
  } = req;

  try {
    const openDashboard = await getOpenDashboard(dashboardID, workspaceID, userID);

    if (openDashboard) {
      await restoreOpenDashboard(dashboardID, workspaceID, userID);
      res.status(200);
    } else {
      await createOpenDashboard(dashboardID, workspaceID, userID);
      res.status(201);
    }

    const openDashboards = await getOpenDashboardsByUser(workspaceID, userID);
    return res.json(openDashboards);
  } catch (err) {
    return next(err);
  }
});

router.delete('/open_dashboard', async (req, res, next) => {
  const {
    query: { dashboardID, workspaceID },
    user: { id: userID },
  } = req;

  try {
    await deleteOpenDashboard(dashboardID, workspaceID, userID);
    const openDashboards = await getOpenDashboardsByUser(workspaceID, userID);

    return res.status(200).json(openDashboards);
  } catch (err) {
    return next(err);
  }
});

router.delete('/open_dashboard/multiple', async (req, res, next) => {
  const {
    query: { dashboardIDArray = [], workspaceID },
    user: { id: userID },
  } = req;

  try {
    const promises = dashboardIDArray.map(dashboardID =>
      deleteOpenDashboard(dashboardID, workspaceID, userID),
    );
    await Promise.all(promises);
    const openDashboards = await getOpenDashboardsByUser(workspaceID, userID);

    return res.status(200).json(openDashboards);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
