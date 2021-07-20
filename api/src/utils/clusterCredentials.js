const { cluster_credentials: clusterCredentials } = require('../models');
const { decryptHash, encryptPassword } = require('./auth');
const { unNestSequelizeObj } = require('./sequelize');
const axios = require('axios');

const createClusterCreds = async (clusterID, password, userID, username) => {
  let hash = null;

  // Don't save empty string value
  username = username === '' ? null : username;

  if (username && password) {
    hash = encryptPassword(password);
  }

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
  let hash = null;

  // Don't save empty string value
  username = username === '' ? null : username;

  if (username && password) {
    hash = encryptPassword(password);
  }

  return await clusterCredentials.update({ username, hash }, { where: { userID, clusterID } });
};

const isClusterCredsValid = async (cluster, username, password) => {
  return await axios.get(`${cluster.host}:${cluster.infoPort}/WsTopology/TpListTargetClusters.json`, {
    auth: { username, password },
  });
};

module.exports = {
  checkForClusterCreds,
  createClusterCreds,
  getClusterCreds,
  updateClusterCreds,
  isClusterCredsValid,
};
