const { cluster: clusterModel } = require('../models');

const getClusters = async () => {
  let clusters;

  try {
    clusters = await clusterModel.findAll();
  } catch (err) {
    throw err;
  }

  return clusters;
};

const getClusterByID = async id => {
  let cluster;

  try {
    cluster = await clusterModel.findOne({ where: { id } });
  } catch (err) {
    throw err;
  }

  return cluster.dataValues;
};

module.exports = { getClusterByID, getClusters };
