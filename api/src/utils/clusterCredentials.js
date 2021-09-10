const { cluster_credentials: clusterCredentials } = require('../models');
const { decryptHash, encryptPassword } = require('./auth');
const { unNestSequelizeObj } = require('./sequelize');
const axios = require('axios');

const createClusterCreds = async (clusterID, password, userID, username) => {
  const hash = password ? encryptPassword(password) : '';

  return await clusterCredentials.create({ username, hash, userID, clusterID });
};

const checkForClusterCreds = async (clusterID, userID) => {
  let clusterCreds = await clusterCredentials.findOne({ where: { clusterID, userID } });
  clusterCreds = unNestSequelizeObj(clusterCreds);

  return clusterCreds;
};

const getClusterCreds = async (clusterID, userID) => {
  let clusterCreds = await clusterCredentials.findOne({
    attributes: ['hash', 'username'],
    where: { clusterID, userID },
  });
  clusterCreds = unNestSequelizeObj(clusterCreds);
  const { hash, username } = clusterCreds || {};

  return { password: decryptHash(hash), username };
};

const updateClusterCreds = async (clusterID, password, userID, username) => {
  const hash = password ? encryptPassword(password) : '';

  return await clusterCredentials.update({ username, hash }, { where: { userID, clusterID } });
};

const isClusterCredsValid = async (cluster, username, password) => {
  const result = await axios.get(`${cluster.host}:${cluster.infoPort}/WsTopology/TpListTargetClusters.json`, {
    auth: { username, password },
  });
  if (result.data.TpListTargetClustersResponse) {
    return result;
  } else {
    throw new Error('Can not access HPCC cluster');
  }
};

module.exports = {
  checkForClusterCreds,
  createClusterCreds,
  getClusterCreds,
  updateClusterCreds,
  isClusterCredsValid,
};
