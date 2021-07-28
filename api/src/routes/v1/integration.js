/* eslint-disable no-unused-vars */
const { getChartsByDashboardID, createChart, getChartByID } = require('../../utils/chart');
const { getClusterByHost, createCluster } = require('../../utils/cluster');
const {
  getDashboardByWokspaceAndCluster,
  createDashboard,
  getDashboardByID,
  updateDashboardLayout,
} = require('../../utils/dashboard');
const { createDashboardPermission } = require('../../utils/dashboardPermission');
const { getSourceByHpccID, createSource } = require('../../utils/source');
const { getUserByEmail } = require('../../utils/user');
const { getWorkspacesByUserID, getWorkspaceByID, createWorkspace } = require('../../utils/workspace');
const {
  getWorkspaceDirectory,
  updateWorkspaceDirectory,
  createWorkspaceDirectory,
} = require('../../utils/workspaceDirectory');
const { createWorkspacePermission } = require('../../utils/workspacePermission');

const SHARE_URL = process.env.SHARE_URL;

const router = require('express').Router();

router.post('/', async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.body.user.email);
    const workspace = await findOrCreateWorkspace(user.id, req.body.workspaceName);
    const cluster = await findOrCreateCluster(req.body.cluster);
    const dashboard = await findOrCreateDashboard(workspace.id, cluster.id, user.id, req.body.dashboardName);
    await updateOrCreateWorkspaceDirectory(dashboard, workspace.id, user.id); // this one is for directories to appear in drawer
    const source = await findOrCreateSource(req.body.selectedSource);
    const dataSets = { name: source.name, fields: [] };
    const dbNewChart = await createNewChart(dataSets, dashboard, source.id, user.id);

    const url = SHARE_URL || 'http://localhost:3000';
    const link = `${url}/workspace/${workspace.id}`;
    return res.status(200).send({ workspaceUrl: link });
  } catch (error) {
    return next(error);
  }
});

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

const findOrCreateDashboard = async (workspaceID, clusterID, userID, dashboardName) => {
  const dashboard = await getDashboardByWokspaceAndCluster(workspaceID, clusterID, userID, dashboardName);
  if (dashboard) return dashboard;
  const newDashboardID = await createDashboard({ name: dashboardName, clusterID }, workspaceID);
  await createDashboardPermission(newDashboardID, userID, 'Owner');
  return await getDashboardByID(newDashboardID, userID);
};

const updateOrCreateWorkspaceDirectory = async (dashboard, workspaceID, userID) => {
  /* workspaceFile represents a dashboard, Ids and name should be the same as dashboard*/
  const workspaceFile = {
    id: dashboard.id, // should be unique
    name: dashboard.name, // should be unique
    favorite: false,
    shared: false,
  };

  const workspaceDirectoriesArray = await getWorkspaceDirectory(workspaceID, userID);

  if (workspaceDirectoriesArray?.directory) {
    const { directory } = workspaceDirectoriesArray;
    const existingFile = directory.find(el => el.name === workspaceFile.name);
    if (existingFile) return;
    return await updateWorkspaceDirectory([...directory, workspaceFile], workspaceID, userID);
  } else {
    const newDirectory = [workspaceFile];
    return await createWorkspaceDirectory(newDirectory, workspaceID, userID);
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
    isIntegrationChart: true,
  };

  const charts = await getChartsByDashboardID(dashboard.id);
  const dbNewChart = await createChart(chart, dashboard.id, sourceID, charts.length);
  const chartLayout = mapChartIdToLayout(dbNewChart.id, charts.length);
  if (!dashboard.layout) {
    const initialLayout = { lg: [chartLayout] };
    const initialLayoutToJson = JSON.stringify(initialLayout);
    await updateDashboardLayout(dashboard.id, initialLayoutToJson);
  } else {
    const dashLayout = JSON.parse(dashboard.layout);
    dashLayout.lg = [...dashLayout.lg, chartLayout];
    const newLayout = JSON.stringify(dashLayout);
    await updateDashboardLayout(dashboard.id, newLayout);
  }
  return dbNewChart;
};

const defaultParams = [
  { name: 'Start', type: 'number', value: '' },
  { name: 'Count', type: 'number', value: '' },
];

const mapChartIdToLayout = (chartId, totalCharts) => ({
  i: chartId.toString(),
  x: 0,
  y: parseInt(totalCharts * 20),
  w: 12,
  h: 20,
  minW: 2,
  maxW: 12,
  minH: 3,
});

module.exports = router;
