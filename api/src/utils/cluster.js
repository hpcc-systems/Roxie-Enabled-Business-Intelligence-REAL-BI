const { cluster: Cluster } = require('../models');
const { removeFields, unNestSequelizeObj } = require('./sequelize');

const getClusterByID = async id => {
  let cluster = await Cluster.findOne({ where: { id } });
  cluster = unNestSequelizeObj(cluster);

  return cluster;
};

const getAllClusters = async () => {
  let clusters = await Cluster.findAll(removeFields([]));
  clusters = clusters.map(cluster => unNestSequelizeObj(cluster));

  return clusters;
};

const createCluster = async cluster => {
  let newCluster = Cluster.create({ ...cluster });
  newCluster = unNestSequelizeObj(newCluster);

  return newCluster;
};

module.exports = { getClusterByID, createCluster, getAllClusters };
