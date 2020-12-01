const router = require('express').Router();

const {
  getOpenDashboardsByUser,
  createOpenDashboard,
  getOpenDashboard,
  restoreOpenDashboard,
  deleteOpenDashboard,
} = require('../../utils/openDashboards');
// Utils
const { updateLastViewedWorkspace } = require('../../utils/user');
const {
  createWorkspace,
  updateWorkspaceByID,
  deleteWorkspaceByID,
  getWorkspacesByUserID,
  getWorkspaceByID,
} = require('../../utils/workspace');
const { createWorkspacePermission } = require('../../utils/workspacePermission');

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
    body: { name, workspaceID },
    user: { id: userID },
  } = req;

  try {
    await updateWorkspaceByID(name, workspaceID);
    const workspaces = await getWorkspacesByUserID(userID);

    return res.status(200).send(workspaces);
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
    await deleteWorkspaceByID(workspaceID);
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
    query: { workspaceID },
    user: { id: userID },
  } = req;

  try {
    const workspace = await getWorkspaceByID(workspaceID, userID);

    return res.status(200).json(workspace);
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
