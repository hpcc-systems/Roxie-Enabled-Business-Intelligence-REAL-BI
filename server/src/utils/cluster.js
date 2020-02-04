const { cluster: clusterModel } = require('../models');

const getClusters = async () => {
  let clusters;

  try {
    clusters = await clusterModel.findAll();
  } catch (err) {
    return err;
  }

  return clusters;
};

const getClusterByID = async id => {
  let cluster;

  try {
    cluster = await clusterModel.findOne({ where: { id } });
  } catch (err) {
    return err;
  }

  return cluster.dataValues;
};

module.exports = { getClusterByID, getClusters };
