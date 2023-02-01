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
        user: { email: 'admin@lexisnexisrisk.com' },
        editingAllowed: true,
        workspaceName: 'Tombolo', // Arbitrary name
        dashboardName: 'Workunits123', // this dashboard will show only files form this cluster. if you have files from other cluster, create new dash like "Tombolo ([cluster Name])"
      },
    ); // PROVIDE BODY FOR TESTING
    console.log('result :>> ', result.data);
    setRespond(result.data);
  };

  return (
    <Box>
      <Button onClick={sendRequest}> Test Tombolo Integration</Button>

      {respond ? (
        <>
          <Link href={respond.workspaceUrl} variant='body2'>
            {respond.workspaceUrl}
          </Link>
          <pre>{JSON.stringify(respond, null, 2)}</pre>
        </>
      ) : null}
    </Box>
  );
}

export default TestTomboloIntegration;
