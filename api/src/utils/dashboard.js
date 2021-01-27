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
const { unNestSequelizeObj, removeFields } = require('./sequelize');

const getDashboardByID = async (id, userID) => {
  let dashboard = await Dashboard.findOne({
    ...removeFields(['workspaceID', 'clusterID']),
    where: { id },
    include: [
      { model: Cluster, ...removeFields([]), required: true },
      {
        model: DashboardPermission,
        as: 'permission',
        where: { userID },
        required: true,
        include: { model: Role, attributes: ['name'], required: true },
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
  dashboard.permission = dashboard.permission[0].role.name;
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

const createDashboard = async (dashboard, workspaceID) => {
  const { clusterID, name } = dashboard;
  const newDashboard = await Dashboard.create({ name: name.trim(), workspaceID, clusterID });
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

module.exports = {
  createDashboard,
  deleteDashboardByID,
  getDashboardByID,
  getSharedDashboardUsers,
  updateDashboardByID,
};
