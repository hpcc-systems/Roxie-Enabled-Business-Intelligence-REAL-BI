const hpccJSComms = require('@hpcc-js/comms');
const { getClusterCreds } = require('./clusterCredentials');

module.exports.getHPCCService = async (service, userID, cluster, clusterCreds) => {
  if (!service) throw new Error('Service type is not provided');

  const { id: clusterID, host, dataPort, infoPort } = cluster;
  if (!clusterCreds) clusterCreds = await getClusterCreds(clusterID, userID);

  const port = service === 'ecl' ? dataPort : infoPort;

  const connectionSettings = {
    baseUrl: `${host}:${port}`,
    userID: clusterCreds.usename || '',
    password: clusterCreds.password || '',
  };

  if (service === 'ecl') return new hpccJSComms.EclService(connectionSettings);
  if (service === 'wu') return new hpccJSComms.WorkunitsService(connectionSettings);

  throw new Error('Service does not exist');
};
