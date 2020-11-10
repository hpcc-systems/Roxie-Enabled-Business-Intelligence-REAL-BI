const { chart: Chart, dashboard_relation: DashboardRelation } = require('../models');
const { unNestSequelizeObj, removeFields } = require('./sequelize');

const createRelation = async (relationObj, dashboardID) => {
  return await DashboardRelation.create({ ...relationObj, dashboardID });
};

const updateRelation = async relationObj => {
  const { id, ...updatedKeys } = relationObj;
  return await DashboardRelation.update({ ...updatedKeys }, { where: { id } });
};

const deleteRelation = async id => {
  return await DashboardRelation.destroy({ where: { id } });
};

const getDashboardRelationsByDashboardID = async dashboardID => {
  let relations = await DashboardRelation.findAll({
    ...removeFields(['dashboardID'], true),
    where: { dashboardID },
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
  });
  relations = relations.map(relation => unNestSequelizeObj(relation));

  return relations;
};

const getDashboardRelationsByChartID = async (dashboardID, sourceObj, targetID) => {
  const { chartID: sourceID, field: sourceField } = sourceObj;

  let relations = await DashboardRelation.findAll({
    ...removeFields(['dashboardID'], true),
    where: { dashboardID, sourceID, sourceField, targetID },
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
  });
  relations = relations.map(relation => unNestSequelizeObj(relation));

  return relations;
};

module.exports = {
  createRelation,
  deleteRelation,
  getDashboardRelationsByChartID,
  getDashboardRelationsByDashboardID,
  updateRelation,
};
