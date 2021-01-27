const {
  cluster: Cluster,
  dashboard_filter: DashboardFilter,
  dashboard_filter_value: DashboardFilterValue,
  Sequelize,
  source: Source,
  source_type: SourceType,
} = require('../models');
const { unNestSequelizeObj, removeFields } = require('./sequelize');

const createFilter = async ({ clusterID, dashboardID, filterObj, sourceID }) => {
  let filter = await DashboardFilter.create({ configuration: filterObj, clusterID, dashboardID, sourceID });
  filter = unNestSequelizeObj(filter);

  return filter;
};

const updateFilter = async (filterObj, sourceID) => {
  const { id, ...updatedKeys } = filterObj;
  return await DashboardFilter.update({ configuration: updatedKeys, sourceID }, { where: { id } });
};

const deleteFilter = async id => {
  return await DashboardFilter.destroy({ where: { id } });
};

const createFilterValue = async (dashboardFilterID, userID) => {
  return await DashboardFilterValue.create({ dashboardFilterID, userID });
};

const updateFilterValue = async valueObj => {
  const { id, ...updatedKeys } = valueObj;

  // Don't save empty string value
  const value = updatedKeys.value === '' ? null : updatedKeys.value;

  return await DashboardFilterValue.update({ ...updatedKeys, value }, { where: { id } });
};

const getDashboardFilter = async (id, userID) => {
  let filter = await DashboardFilter.findOne({
    ...removeFields(['clusterID', 'dashboardID', 'sourceID']),
    where: { id },
    include: [
      { model: Cluster, ...removeFields([]) },
      {
        model: Source,
        as: 'source',
        ...removeFields(['typeID']),
        include: {
          model: SourceType,
          as: 'type',
          attributes: ['name'],
          required: true,
        },
      },
      {
        model: DashboardFilterValue,
        as: 'value',
        ...removeFields(['dashboardFilterID', 'userID']),
        where: { userID },
      },
    ],
  });

  filter = unNestSequelizeObj(filter);

  if (filter.source) {
    filter.source = unNestSequelizeObj(filter.source);
    filter.source.type = filter.source.type.name;
  }

  filter.value = filter.value[0];

  return filter;
};

const getDashboardFiltersByDashboardID = async (dashboardID, userID) => {
  let filters = await DashboardFilter.findAll({
    ...removeFields(['clusterID', 'dashboardID', 'sourceID']),
    where: { dashboardID },
    include: [
      { model: Cluster, ...removeFields([]) },
      {
        model: Source,
        as: 'source',
        ...removeFields(['typeID']),
        include: {
          model: SourceType,
          as: 'type',
          attributes: ['name'],
          required: true,
        },
      },
      {
        model: DashboardFilterValue,
        as: 'value',
        ...removeFields(['dashboardFilterID', 'userID']),
        where: { userID },
      },
    ],
  });
  filters = filters.map(filter => {
    filter = unNestSequelizeObj(filter);
    filter.cluster = unNestSequelizeObj(filter.cluster);

    if (filter.source) {
      filter.source = unNestSequelizeObj(filter.source);
      filter.source.type = filter.source.type.name;
    }

    filter.value = filter.value[0];

    return filter;
  });

  return filters;
};

const getDashboardFiltersWithValues = async (chartID, dashboardID, userID) => {
  let filters = await DashboardFilter.findAll({
    ...removeFields(['dashboardID', 'sourceID']),
    where: { configuration: { [Sequelize.Op.substring]: chartID }, dashboardID },
    include: {
      model: DashboardFilterValue,
      as: 'value',
      ...removeFields(['dashboardFilterID', 'userID']),
      where: { value: { [Sequelize.Op.ne]: null }, userID },
      required: true,
    },
  });
  filters = filters.map(filter => {
    filter = unNestSequelizeObj(filter);
    filter.value = unNestSequelizeObj(filter.value[0]).value;

    return filter;
  });

  return filters;
};

const getDashboardFilterValue = async (dashboardFilterID, userID) => {
  let valueRow = await DashboardFilterValue.findOne({ where: { dashboardFilterID, userID } });
  valueRow = unNestSequelizeObj(valueRow);

  return valueRow;
};

module.exports = {
  createFilter,
  createFilterValue,
  deleteFilter,
  getDashboardFilter,
  getDashboardFiltersByDashboardID,
  getDashboardFiltersWithValues,
  getDashboardFilterValue,
  updateFilter,
  updateFilterValue,
};
