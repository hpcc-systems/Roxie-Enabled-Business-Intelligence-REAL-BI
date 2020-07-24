const router = require('express').Router();

// Utils
const errHandler = require('../../utils/errHandler');
const { updateLastWorkspace } = require('../../utils/user');
const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceByID,
  updateDirectory,
  updateDirectoryDepth,
  updateOpenDashboards,
} = require('../../utils/workspace');

router.get('/all', async (req, res) => {
  const { userID } = req.user;
  let workspaces;

  try {
    workspaces = await getWorkspaces(userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    return res.status(status).send(errMsg);
  }

  res.status(200).send(workspaces);
});

router.post('/', async (req, res) => {
  const {
    body: { name },
    user: { id: userID },
  } = req;
  let workspaces;

  try {
    await createWorkspace(name, userID);
    workspaces = await getWorkspaces(userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    return res.status(status).send(errMsg);
  }

  res.status(201).send(workspaces);
});

router.put('/last', async (req, res) => {
  const {
    body: { workspaceID },
    user: { id: userID },
  } = req;

  try {
    await updateLastWorkspace(workspaceID, userID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    return res.status(status).send(errMsg);
  }

  return res.status(204).end();
});

router.get('/find', async (req, res) => {
  const { workspaceID } = req.query;
  let workspace;

  try {
    workspace = await getWorkspaceByID(workspaceID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    return res.status(status).send(errMsg);
  }

  res.status(200).send(workspace);
});

router.put('/directory', async (req, res) => {
  const { directory, directoryDepth, workspaceID } = req.body;
  let workspace;

  try {
    await updateDirectory(directory, workspaceID);
    await updateDirectoryDepth(directoryDepth, workspaceID);
    workspace = await getWorkspaceByID(workspaceID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    return res.status(status).send(errMsg);
  }

  res.status(202).send(workspace);
});

router.post('/dashboard', async (req, res) => {
  const { dashboardObj, workspaceID } = req.body;
  let dashboards, workspace;

  try {
    workspace = await getWorkspaceByID(workspaceID);

    // Append new dashboard to array
    dashboards = [...workspace.openDashboards, dashboardObj];

    await updateOpenDashboards(dashboards, workspaceID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    return res.status(status).send(errMsg);
  }

  res.status(202).send(dashboards);
});

router.put('/dashboard', async (req, res) => {
  const { dashboardID, workspaceID } = req.body;
  let dashboards, workspace;

  try {
    workspace = await getWorkspaceByID(workspaceID);

    // Remove selected dashboard from array
    dashboards = workspace.openDashboards.filter(({ id }) => id !== dashboardID);

    await updateOpenDashboards(dashboards, workspaceID);
  } catch (err) {
    const { errMsg, status } = errHandler(err);

    return res.status(status).send(errMsg);
  }

  res.status(202).send(dashboards);
});

module.exports = router;
