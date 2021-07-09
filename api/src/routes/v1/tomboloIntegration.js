/* eslint-disable no-unused-vars */
const { getClusterByHost, createCluster } = require('../../utils/cluster');
const { checkForClusterCreds, createClusterCreds } = require('../../utils/clusterCredentials');
const {
  getDashboardByWokspaceAndCluster,
  createDashboard,
  getDashboardByID,
} = require('../../utils/dashboard');
const { createDashboardPermission } = require('../../utils/dashboardPermission');
const { getFileDatasetFromCluster } = require('../../utils/hpccFiles');
const { getWorkspacesByUserID, getWorkspaceByID, createWorkspace } = require('../../utils/workspace');
const {
  getWorkspaceDirectory,
  updateWorkspaceDirectory,
  createWorkspaceDirectory,
} = require('../../utils/workspaceDirectory');
const { createWorkspacePermission } = require('../../utils/workspacePermission');

const router = require('express').Router();

router.post('/', async (req, res, next) => {
  //  name : 'testCluster', host: 'http://10.173.147.1', infoPort: '8010', dataPort: '8002',
  const cluster = { name: 'testCluster', host: 'http://10.173.147.1', infoPort: '8010', dataPort: '8002' };
  const clusterCreds = { username: 'username', password: 'password' };
  // const fileMetaData = {
  //   cluster: ClusterName, // hpcc file object has ClusterName key in it
  //   hpccID: Name, // hpcc file object has Name key in it
  //   name: Name,
  //   target: 'file',
  // }
  req.body.cluster = cluster;
  req.body.clusterCreds = clusterCreds;

  try {
    const workspace = await findOrCreateWorkspace(req.user.id);
    const cluster = await findOrCreateCluster(req.body.cluster);
    const clusterCreds = await findOrCreateClusterCreds(cluster.id, req.body.clusterCreds, req.user.id);
    const dashboard = await findOrCreateDashboard(workspace.id, cluster.id, req.user.id, 'Tombolo');
    await updateOrCreateWorkspaceDirectory(dashboard, workspace.id, req.user.id); // this one is for directories to appear in drawer
    // const dataSets = await getFileDatasetFromCluster(cluster, JSON.parse(source), userID);

    return res.status(200).send(dashboard);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

const findOrCreateWorkspace = async userID => {
  const allWorkspacesInfo = await getWorkspacesByUserID(userID);
  if (allWorkspacesInfo) {
    const searchedWorkspaceInfo = allWorkspacesInfo.find(el => el.name === 'Tombolo'); // MAKE SURE UR WORKSPACE NAMED SAME
    if (searchedWorkspaceInfo) {
      return await getWorkspaceByID(searchedWorkspaceInfo.id, userID);
    }
  } else {
    const workspace = await createWorkspace('Tombolo', userID);
    await createWorkspacePermission(workspace.id, userID, 'Owner');
    return workspace;
  }
};

const findOrCreateCluster = async cluster => {
  const dbCluster = await getClusterByHost(cluster.host);
  if (dbCluster) return dbCluster;
  return await createCluster(cluster);
};

const findOrCreateClusterCreds = async (clusterID, clusterCreds, userID) => {
  const clusterCredentials = await checkForClusterCreds(clusterID, userID);
  if (clusterCredentials) return clusterCredentials;
  const newClusterCreds = await createClusterCreds(
    clusterID,
    clusterCreds.password,
    userID,
    clusterCreds.username,
  );
  return newClusterCreds;
};

const findOrCreateDashboard = async (workspaceID, clusterID, userID, name) => {
  const dashboard = await getDashboardByWokspaceAndCluster(workspaceID, clusterID, userID, name);
  if (dashboard) return dashboard;
  const newDashboardID = await createDashboard({ name, clusterID }, workspaceID);
  await createDashboardPermission(newDashboardID, userID, 'Owner');
  return await getDashboardByID(newDashboardID, userID);
};

const updateOrCreateWorkspaceDirectory = async (dashboard, workspaceID, userID) => {
  const workspaceDirectoryObj = {
    id: dashboard.id,
    name: dashboard.name,
    favorite: false,
    shared: false,
  };

  const workspaceDirectoriesArray = await getWorkspaceDirectory(workspaceID, userID);
  if (workspaceDirectoriesArray?.directory) {
    const { directory } = workspaceDirectoriesArray;
    const duplicate = directory.find(el => el.name === workspaceDirectoryObj.name);
    if (duplicate) return;
    const newDirectory = [...directory, workspaceDirectoryObj];
    await updateWorkspaceDirectory(newDirectory, workspaceID, userID);
  } else {
    const directory = [workspaceDirectoryObj];
    await createWorkspaceDirectory(directory, workspaceID, userID);
  }
};
