const { findOrCreateDashboard, updateDashboardLayout } = require('./dashboard');
const { updateOrCreateWorkspaceDirectory } = require('./workspaceDirectory');
const { createWorkspacePermission } = require('./workspacePermission');
const { addDashboardAsOpenDashboard } = require('./openDashboards');
const { createClusterCreds } = require('./clusterCredentials');
const { findOrCreateCluster } = require('./cluster');
const { createMultipleCharts } = require('./chart');
const { createWorkspace } = require('./workspace');
const { findOrCreateSource } = require('./source');
const {
  defaultChartsConfigs,
  defaultChartslayout,
  defaultWorkspaceName,
  defaultDashboardName,
  defaultSourceFiles,
  defaultCluster,
} = require('../DefaultCharts');

const createDemoWorkspace = async user => {
  try {
    //1.create private workspace
    const workspace = await createWorkspace(defaultWorkspaceName, user.id, 'private');
    await createWorkspacePermission(workspace.id, user.id, 'Owner');
    //2.Find cluster and add credentials ( cluster is open but we still need to add empty creds so user wont be prompted)
    const cluster = await findOrCreateCluster(defaultCluster);
    await createClusterCreds(cluster.id, '', user.id, '');
    //3.Create default dashboard and dash Permission
    const dashboard = await findOrCreateDashboard(
      workspace.id,
      cluster.id,
      user.id,
      defaultDashboardName,
      null, // file name , we dont want to associate any filename to default dashboard
      'Owner',
    );
    //4. add dash to tabs and to drawer.
    await addDashboardAsOpenDashboard(dashboard.id, workspace.id, user.id);
    await updateOrCreateWorkspaceDirectory(dashboard, workspace.id);
    //5. find source or create source.
    const sources = await Promise.all(
      Object.keys(defaultSourceFiles).map(file => findOrCreateSource(defaultSourceFiles[file], 'file')),
    );
    //6. add default charts
    const chartForDashboard = defaultChartsConfigs.map(chart => {
      const chartSource = sources.find(el => el.hpccID === chart.dataset);
      return {
        configuration: chart,
        dashboardID: dashboard.id,
        sourceID: chartSource?.id || null,
      };
    });
    const charts = await createMultipleCharts(chartForDashboard);
    //7. add Default layout
    const sortedCharts = charts.sort((a, b) => {
      a.configuration.sort - b.configuration.sort;
    });
    const defaultLayoutsWithChartIds = defaultChartslayout.lg.reduce(
      (acc, el, index) => {
        let gridItem = {
          i: String(sortedCharts[index].id),
          x: 0,
          y: index * 20,
          h: 20,
          minW: 2,
          maxW: 12,
          minH: 4,
        };
        for (const key in acc) {
          const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
          if (key === 'lg') {
            gridItem = { ...el, i: String(sortedCharts[index].id) };
          } else {
            gridItem.w = cols[key];
          }
          acc[key].push({ ...gridItem });
        }
        return acc;
      },
      { lg: [], md: [], sm: [], xs: [], xxs: [] },
    );
    const layoutToJson = JSON.stringify(defaultLayoutsWithChartIds);
    await updateDashboardLayout(dashboard.id, layoutToJson);

    return workspace.id; // return workspace Id, will be assigned as a lastViedWorkpace
  } catch (err) {
    console.log('-----------------');
    console.log(`err`, err);
    console.log('-----------------');
    return null;
  }
};

module.exports = { createDemoWorkspace };
