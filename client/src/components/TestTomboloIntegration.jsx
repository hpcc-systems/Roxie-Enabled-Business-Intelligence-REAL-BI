import React, { useState } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Link } from '@material-ui/core';

function TestTomboloIntegration() {
  const [respond, setRespond] = useState(null);
  const sendRequest = async () => {
    const result = await axios.post(
      '/api/v1/integration',

      {
        user: { email: 'Kostiantyn.Agapov@lexisnexisrisk.com' }, // temp hack to avoid passport middleware, this key is added by passport
        cluster: {
          name: 'http://10.173.147.1',
          host: 'http://10.173.147.1',
          infoPort: '8010',
          dataPort: '8002',
        },
        filename: 'temp::hfs::taxidata_small',
        workspaceName: 'Tombolo', // Arbitrary name
        dashboardName: 'Tombolo (testCluster)', // this dashboard will show only files form this cluster. if you have files from other cluster, create new dash like "Tombolo ([cluster Name])"
      },
      // {
      //   user: { email: 'admin@lexisnexisrisk.com' },
      //   cluster: {
      //     name: 'http://10.173.147.1',
      //     host: 'http://10.173.147.1',
      //     infoPort: '8010',
      //     dataPort: '8002',
      //   },
      //   filename: 'asdf::aaa::fake_people.csv_thor',
      //   workspaceName: 'Tombolo',
      //   dashboardName: 'Tombolo dash title', //title
      // },
      // {
      //   user: { email: 'Kostiantyn.Agapov@lexisnexisrisk.com' }, // temp hack to avoid passport middleware, this key is added by passport
      //   cluster: {
      //     name: 'http://10.173.147.1',
      //     host: 'http://alpha_qc_thor_esp.risk.regn.net',
      //     infoPort: '8010',
      //     dataPort: '8002',
      //   },
      //   filename: 'base::personcontext::exemption::20210701031504prod::productid',
      //   workspaceName: 'Tombolo', // Arbitrary name
      //   dashboardName: 'Tombolo (alpha_qc)', // maybe need to add cluster name like Tombolo (new_cluster)
      // },
    ); // PROVIDE BODY FOR TESTING
    console.log('result :>> ', result.data);
    setRespond(result.data);
  };

  return (
    <Box>
      <Button onClick={sendRequest}> Test Tombolo Integration</Button>
      {/* <pre>{JSON.stringify(respond, null, 2)}</pre> */}
      {respond ? (
        <Link href={respond.workspaceUrl} variant='body2'>
          {respond.workspaceUrl}
        </Link>
      ) : null}
    </Box>
  );
}

export default TestTomboloIntegration;
