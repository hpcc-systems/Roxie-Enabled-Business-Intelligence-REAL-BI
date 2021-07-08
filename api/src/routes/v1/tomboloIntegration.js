const { getClusterByHost, createCluster } = require('../../utils/cluster');
const { getDashboardByWokspaceAndCluster, createDashboard } = require('../../utils/dashboard');
const { getWorkspacesByUserID, getWorkspaceByID, createWorkspace } = require('../../utils/workspace');

const router = require('express').Router();

router.post('/', async (req, res, next) => {
  //  name : 'testCluster', host: 'http://10.173.147.1', infoPort: '8010', dataPort: '8002',
  req.body = { cluster: { host: 'http://10.173.147.1' } };

  try {
    //1. find or Create TOMBOLO WORKSPACE
    const workspace = await findOrCreateWorkspace(req.user.id);
    const cluster = await findOrCreateCluser(req.body.cluster);
    const dashboard = await findOrCreateDashboard(workspace.id, cluster.id, req.user.id, 'Tombolo');
    return res.status(200).send(dashboard);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

const findOrCreateWorkspace = async userID => {
  const allWorkspacesInfo = await getWorkspacesByUserID(userID);
  if (allWorkspacesInfo) {
    const searchedWorkspaceInfo = allWorkspacesInfo.find(el => el.name === 'Tombolo');
    if (searchedWorkspaceInfo) {
      return await getWorkspaceByID(searchedWorkspaceInfo.id, userID);
    }
  } else {
    return await createWorkspace('Tombolo', userID);
  }
};

const findOrCreateCluser = async cluster => {
  const dbCluster = await getClusterByHost(cluster.host);
  if (dbCluster) return dbCluster;
  return await createCluster(cluster);
};

const findOrCreateDashboard = async (worspaceID, clusterID, userID, name) => {
  const dashboard = await getDashboardByWokspaceAndCluster(worspaceID, clusterID, userID, name);
  if (dashboard) return dashboard;
  return await createDashboard({ name, clusterID }, worspaceID);
};
