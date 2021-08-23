const { Op } = require('sequelize');
const {
  chart: Chart,
  cluster: Cluster,
  dashboard: Dashboard,
  dashboard_filter: DashboardFilter,
  dashboard_filter_value: DashboardFilterValue,
  dashboard_permission: DashboardPermission,
  dashboard_relation: DashboardRelation,
  role: Role,
  source: Source,
  source_type: SourceType,
  user: User,
} = require('../models');
const { createOrUpdateDashboardPermission } = require('./dashboardPermission');
const { unNestSequelizeObj, removeFields } = require('./sequelize');

const getDashboardByID = async (id, userID) => {
  let dashboard = await Dashboard.findOne({
    ...removeFields(['workspaceID', 'clusterID', 'updatedAt', 'deletedAt'], false), // we need createdAt but not the rest
    where: { id },
    include: [
      { model: Cluster, ...removeFields([]), required: true },
      {
        model: DashboardPermission,
        as: 'permission',
        where: { userID },
        required: false,
        include: { model: Role, attributes: ['name'], required: false },
      },
      {
        model: DashboardFilter,
        as: 'filters',
        ...removeFields(['clusterID', 'dashboardID', 'sourceID']),
        include: [
          { model: Cluster, ...removeFields([]) },
          {
            model: Source,
            as: 'source',
            ...removeFields(['typeID']),
            include: { model: SourceType, as: 'type', attributes: ['name'], required: true },
          },
          {
            model: DashboardFilterValue,
            as: 'value',
            ...removeFields(['dashboardFilterID', 'userID']),
            were: { userID },
          },
        ],
      },
      {
        model: DashboardRelation,
        as: 'relations',
        ...removeFields(['dashboardID']),
        include: [
          {
            model: Chart,
            as: 'source',
            attributes: [],
            required: true,
          },
          {
            model: Chart,
            as: 'target',
            attributes: [],
            required: true,
          },
        ],
      },
      {
        model: Chart,
        as: 'charts',
        ...removeFields(['dashboardID', 'sourceID']),
        include: {
          model: Source,
          as: 'source',
          ...removeFields(['typeID']),
          include: { model: SourceType, as: 'type', attributes: ['name'], required: true },
        },
      },
    ],
  });
  dashboard = unNestSequelizeObj(dashboard);
  dashboard.permission = dashboard?.permission?.[0]?.role?.name || 'Read-Only'; // if now permission is in DB then user came via shared link and should have read only permission
  dashboard.cluster = unNestSequelizeObj(dashboard.cluster);
  dashboard.charts = dashboard.charts.map(chart => {
    chart = unNestSequelizeObj(chart);
    chart.source = unNestSequelizeObj(chart.source);

    // Static text fields will not have a source
    if (chart.source) {
      chart.source.type = chart.source.type.name;
    }

    return chart;
  });
  dashboard.filters = dashboard.filters.map(filter => {
    filter = unNestSequelizeObj(filter);

    if (filter.source) {
      filter.source = unNestSequelizeObj(filter.source);
      filter.source.type = filter.source.type.name;
    }

    filter.value = filter.value[0];

    return filter;
  });
  dashboard.relations = dashboard.relations.map(relation => unNestSequelizeObj(relation));

  return dashboard;
};

const createDashboard = async (dashboard, workspaceID, fileName = null) => {
  const { clusterID, name } = dashboard;

  const newDashboard = await Dashboard.create({ name: name.trim(), workspaceID, clusterID, fileName });

  return newDashboard.id;
};

const updateDashboardByID = async (clusterID, id, name) => {
  return await Dashboard.update({ name: name.trim(), clusterID }, { where: { id } });
};

const deleteDashboardByID = async id => {
  return await Dashboard.destroy({ where: { id } });
};

const getSharedDashboardUsers = async (dashboardID, userID) => {
  const usersArr = await DashboardPermission.findAll({
    attributes: [['userID', 'id']],
    where: { dashboardID, userID: { [Op.ne]: userID } },
    include: {
      model: Role,
      attributes: ['name'],
      required: true,
    },
  });

  const users = [];

  for await (let user of usersArr) {
    user = unNestSequelizeObj(user);

    // Format object
    user.permission = user.role.name;
    delete user.role;

    // Add email to user object
    const userDetails = await User.findOne({ attributes: ['email'], where: { id: user.id } });
    user.email = unNestSequelizeObj(userDetails)?.email;

    users.push(user);
  }

  return users;
};

const getDashboardPermission = async (dashboadrId, userId) => {
  const dashboard = await Dashboard.findOne({
    where: { id: dashboadrId },
    include: [
      {
        model: DashboardPermission,
        as: 'permission',
        where: { userId },
        required: true,
        include: { model: Role, attributes: ['name'], required: true },
      },
    ],
  });
  return dashboard.permission[0].role.name;
};

const updateDashboardLayout = async (dashboadrId, newLayout) => {
  return await Dashboard.update({ layout: newLayout }, { where: { id: dashboadrId } });
};

const getDashboardByWorkspaceAndCluster = async (workspaceID, clusterID, name) => {
  const dashboard = await Dashboard.findOne({
    where: { workspaceID, clusterID, name },
  });
  return dashboard;
};

const getDashboardsByWorkspaceID = async workspaceID => {
  return await Dashboard.findAll({ where: { workspaceID } });
};

const findOrCreateDashboard = async (workspaceID, clusterID, userID, dashboardName, fileName, userRole) => {
  const dashboard = await getDashboardByWorkspaceAndCluster(workspaceID, clusterID, dashboardName);
  let dashbordID = dashboard?.id;
  if (!dashboard) {
    dashbordID = await createDashboard({ name: dashboardName, clusterID }, workspaceID, fileName);
  }
  await createOrUpdateDashboardPermission(dashbordID, userID, userRole);
  return await getDashboardByID(dashbordID, userID);
};

module.exports = {
  getDashboardsByWorkspaceID,
  findOrCreateDashboard,
  createDashboard,
  deleteDashboardByID,
  getDashboardByID,
  getSharedDashboardUsers,
  updateDashboardByID,
  updateDashboardLayout,
  getDashboardPermission,
  getDashboardByWokspaceAndCluster: getDashboardByWorkspaceAndCluster,
};
