const hpccJSComms = require('@hpcc-js/comms');
const { getClusterCreds } = require('./clusterCredentials.js');

module.exports.getHPCCService = async (service = 'wu', userID = '', cluster, clusterCreds) => {
  if (!service) throw new Error('Service type is not provided');
  if (!userID && !clusterCreds) throw new Error('Provide userID or clusterCreds');

  const { id: clusterID, host, dataPort, infoPort, roxie_ip } = cluster;
  if (!clusterCreds) clusterCreds = await getClusterCreds(clusterID, userID);

  let port = infoPort;
  let baseUrl = `${host}:${port}`;

  if (service === 'ecl') {
    if (roxie_ip) {
      baseUrl = roxie_ip;
    } else {
      port = dataPort;
    }
  }

  const connectionSettings = {
    baseUrl,
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
  const creds = { username, password };
  try {
    const topologyService = await module.exports.getHPCCService('topology', null, cluster, creds);

    const response = await topologyService.TpLogicalClusterQuery();

    const exceptions = response.Exceptions?.Exception;

    if (exceptions?.length) {
      const message = exceptions.map(exception => exception.Message).join(', ');
      throw new Error('Can not access HPCC cluster,\n' + message);
    }

    return response.TpLogicalClusters?.TpLogicalCluster || [];
  } catch (error) {
    console.log('- isClusterCredsValid error-----------------------------------------');
    console.dir({ error }, { depth: null });
    console.log('------------------------------------------');

    throw error;
  }
};
