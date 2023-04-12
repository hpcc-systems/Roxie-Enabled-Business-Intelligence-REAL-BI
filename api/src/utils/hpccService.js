const hpccJSComms = require('@hpcc-js/comms');
const { getClusterCreds } = require('./clusterCredentials.js');

module.exports.getHPCCService = async (service = 'wu', userID = '', cluster, clusterCreds) => {
  if (!service) throw new Error('Service type is not provided');
  if (!userID && !clusterCreds) throw new Error('Provide userID or clusterCreds');

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
  if (service === 'topology') return new hpccJSComms.TopologyService(connectionSettings);

  throw new Error('Service does not exist');
};

// moved from clusterCredentials.js because of circular dependency error with that was caused by importing getHPCCService in clusterCredentials.js that is using exported getClusterCreds;
module.exports.isClusterCredsValid = async (cluster, username, password) => {
  const topologyService = await module.exports.getHPCCService('topology', null, cluster, {
    username,
    password,
  });
  const response = await topologyService.TpListTargetClusters();

  const exceptions = response.Exceptions?.Exception;

  if (exceptions?.length) {
    const message = exceptions.map(exception => exception.Message).join(', ');
    throw new Error('Can not access HPCC cluster,\n' + message);
  }

  return response.TargetClusters.TpClusterNameType;
};
