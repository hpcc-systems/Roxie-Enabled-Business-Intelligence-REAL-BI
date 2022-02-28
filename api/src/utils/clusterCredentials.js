const {
  dashboard: Dashboard,
  access_on_behalf: AccessOnBehalf,
  cluster_credentials: clusterCredentials,
} = require('../models');
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

const updateClusterCreds = async (clusterID, password, userID, username, onBehalfOf, dashboardID) => {
  const hash = password ? encryptPassword(password) : '';

  if (dashboardID) {
    const dashboard = await Dashboard.findOne({ where: { id: dashboardID } });

    if (dashboard?.accessOnBehalf && onBehalfOf) {
      // IF accessOnBehalf already existed and onBehalfOf if true then update AccessOnBehalf with new creds
      const updatedCreds = await AccessOnBehalf.update(
        { username, hash },
        { where: { id: dashboard.accessOnBehalf } },
      );
      console.log(`----UPDATED AccessOnBehalf ${dashboard.name}--------------------------------------`);
      console.dir({ updatedCreds });
      console.log('------------------------------------------');
      //exit flow
      return { onBehalfOf: true, credsId: dashboard.accessOnBehalf };
    }

    if (!dashboard?.accessOnBehalf && onBehalfOf) {
      // IF accessOnBehalf does not exist and onBehalfOf is true create new cred and update dashboard
      const creds = await AccessOnBehalf.create({ username, hash });
      console.log(`--CREATED AccessOnBehalf ${dashboard.name}----------------------------------------`);
      console.dir({ creds: creds.toJSON() }, { depth: null });
      console.log('------------------------------------------');
      // await dashboard.update({ accessOnBehalf: creds.id });
      //exit flow
      return { onBehalfOf: true, credsId: creds.id };
    }

    // IF accessOnBehalf already exists and onBehalfOf is false delete AccessOnBehalf, onDelete:cascade will delete it from dashboard
    if (dashboard?.accessOnBehalf && !onBehalfOf) {
      const delted = await AccessOnBehalf.destroy({ where: { id: dashboard.accessOnBehalf } });
      console.log(`-Deleted AccessOnBehalf ${dashboard.name}-----------------------------------------`);
      console.dir({ delted }, { depth: null });
      console.log('------------------------------------------');
      // continue flow
    }
  }

  const creds = await clusterCredentials.findOne({ where: { userID, clusterID } });
  const updated = await creds.update({ username, hash });

  console.log('-GENERAL CLUSTER CREDS UPDATED-----------------------------------------');
  console.dir({ updated: updated.toJSON() }, { depth: null });
  console.log('------------------------------------------');

  return { onBehalfOf: false, credsId: creds.id };
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

const getAccessOnBehalf = async id => {
  const creds = await AccessOnBehalf.findOne({ where: { id } });
  return { password: decryptHash(creds.hash), username: creds.username };
};

module.exports = {
  getAccessOnBehalf,
  checkForClusterCreds,
  createClusterCreds,
  getClusterCreds,
  updateClusterCreds,
  isClusterCredsValid,
};
