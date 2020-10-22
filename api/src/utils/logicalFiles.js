/*
  Utility file containing functions pertaining to logical files
*/

const https = require('https');
const axios = require('axios');
const moment = require('moment');
const logger = require('../config/logger');
const { awaitHandler } = require('./misc');
const { getClusterAuth } = require('./clusterAuth');

// Create axios instance that allows self-signed certificates
const instance = axios.create({ httpsAgent: new https.Agent({ rejectUnauthorized: false }) });

module.exports = {
  getFileLastModifiedDate: async (clusterObj, fileName, userID) => {
    const { host, id: clusterID, infoPort } = clusterObj;
    const clusterAuth = await getClusterAuth(clusterID, userID);
    let file;

    // Build request
    const url = `${host}:${infoPort}/WsDfu/DFUQuery.json`;
    const reqBody = { DFUQueryRequest: { LogicalName: fileName } };

    // Log API request
    logger.info(
      `Request made to clusterID #${clusterID} for last modified date of '${fileName}' by userID #${userID}.`,
    );

    let [err, response] = await awaitHandler(instance.post(url, reqBody, { auth: clusterAuth }));

    // Return error
    if (err) throw err;

    // Get nested JSON
    file = response.data.DFUQueryResponse.DFULogicalFiles.DFULogicalFile[0];

    // Return error
    if (!file) {
      throw { response: { message: 'No Matching Filename Found' } };
    }

    // Format datetime stamp
    const datetimeStamp = `${moment(file.Modified).format('L HH:mm:ss')} UTC`;

    // Return last modified date;
    return datetimeStamp;
  },
};
