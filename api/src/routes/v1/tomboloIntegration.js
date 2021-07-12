/* eslint-disable no-unused-vars */
const { getChartsByDashboardID, createChart, getChartByID } = require('../../utils/chart');
const { getClusterByHost, createCluster } = require('../../utils/cluster');
const { checkForClusterCreds, createClusterCreds } = require('../../utils/clusterCredentials');
const {
  getDashboardByWokspaceAndCluster,
  createDashboard,
  getDashboardByID,
  updateDashboardLayout,
} = require('../../utils/dashboard');
const { createDashboardPermission } = require('../../utils/dashboardPermission');
const { getFileDatasetFromCluster } = require('../../utils/hpccFiles');
const { getSourceByHpccID, createSource } = require('../../utils/source');
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
  // this goes to get datasets
  const selectedSource = {
    cluster: 'mythor', // hpcc file object has ClusterName key in it
    hpccID: 'zz3283::run1', // hpcc file object has Name key in it
    name: 'zz3283::run1',
    target: 'file',
  };

  req.body.cluster = cluster;
  req.body.clusterCreds = clusterCreds;

  try {
    const workspace = await findOrCreateWorkspace(req.user.id, 'Tombolo');
    const cluster = await findOrCreateCluster(req.body.cluster);
    const clusterCreds = await findOrCreateClusterCreds(cluster.id, req.body.clusterCreds, req.user.id);
    const dashboard = await findOrCreateDashboard(workspace.id, cluster.id, req.user.id, 'Tombolo');
    await updateOrCreateWorkspaceDirectory(dashboard, workspace.id, req.user.id); // this one is for directories to appear in drawer
    const source = await findOrCreateSource(selectedSource);
    const dataSets = await getFileDatasetFromCluster(cluster, selectedSource, req.user.id);
    const [latestDash, newChart] = await createNewChart(dataSets, dashboard, source.id, req.user.id);

    return res.status(200).send(latestDash);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

const findOrCreateWorkspace = async (userID, workspaceName) => {
  const allWorkspacesInfo = await getWorkspacesByUserID(userID);
  if (allWorkspacesInfo) {
    const searchedWorkspaceInfo = allWorkspacesInfo.find(el => el.name === workspaceName); // MAKE SURE UR WORKSPACE NAMED SAME
    if (searchedWorkspaceInfo) {
      return await getWorkspaceByID(searchedWorkspaceInfo.id, userID);
    }
  }
  const workspace = await createWorkspace(workspaceName, userID);
  await createWorkspacePermission(workspace.id, userID, 'Owner');
  return workspace;
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

const findOrCreateDashboard = async (workspaceID, clusterID, userID, dashboardName) => {
  const dashboard = await getDashboardByWokspaceAndCluster(workspaceID, clusterID, userID, dashboardName);
  if (dashboard) return dashboard;
  const newDashboardID = await createDashboard({ name: dashboardName, clusterID }, workspaceID);
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

const findOrCreateSource = async selectedSource => {
  const source = {
    hpccID: selectedSource.hpccID,
    name: selectedSource.name,
    target: selectedSource.target,
    type: selectedSource.target,
  };
  let dbSource = await getSourceByHpccID(source.hpccID);
  if (!dbSource) {
    dbSource = await createSource(source);
  }
  return dbSource;
};

const createNewChart = async (dataSets, dashboard, sourceID, userID) => {
  const chart = {
    axis1: { showTickLabels: true },
    axis2: { showTickLabels: true },
    axis3: { showTickLabels: true },
    chartDescription: `Description: ${dataSets.name}`,
    dataset: dataSets.name,
    ecl: {},
    fields: dataSets.fields.map(field => ({
      color: '#FFF',
      label: field.name,
      name: field.name,
      asLink: false,
      linkBase: '',
    })),
    groupBy: {},
    horizontal: false,
    isStatic: false,
    mapFields: [{ label: '', name: '' }],
    params: [
      ...defaultParams,
      ...dataSets.fields.map(field => ({ name: field.name, type: 'string', value: '' })),
    ],
    showLastExecuted: true,
    sortBy: {},
    stacked: false,
    title: `Title: ${dataSets.name}`,
    type: 'table',
  };

  const charts = await getChartsByDashboardID(dashboard.id);
  const { id } = await createChart(chart, dashboard.id, sourceID, charts.length);
  const chartLayout = mapChartIdToLayout(id, charts.length);
  if (!dashboard.layout) {
    // chartLayout.y = 0; //first layout object must have number in coordinates.
    const initialLayout = { lg: [chartLayout] };
    const initialLayoutToJson = JSON.stringify(initialLayout);
    await updateDashboardLayout(dashboard.id, initialLayoutToJson);
  } else {
    const dashLayout = JSON.parse(dashboard.layout);
    dashLayout.lg = [...dashLayout.lg, chartLayout];
    const newLayout = JSON.stringify(dashLayout);
    await updateDashboardLayout(dashboard.id, newLayout);
  }

  const latestDashboard = await getDashboardByID(dashboard.id, userID);
  const newChart = await getChartByID(id);
  return [latestDashboard, newChart];
};

const defaultParams = [
  { name: 'Start', type: 'number', value: '' },
  { name: 'Count', type: 'number', value: '' },
];

const mapChartIdToLayout = (chartId, totalCharts) => ({
  i: chartId.toString(),
  x: totalCharts % 2 ? 6 : 0,
  y: totalCharts * 20,
  w: 6,
  h: 20,
  minW: 3,
  maxW: 12,
  minH: 20,
});
