import React, { useState } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Link } from '@material-ui/core';

function TestTomboloIntegration() {
  const [respond, setRespond] = useState(null);
  const sendRequest = async () => {
    const result = await axios.post('/api/v1/integration'); // PROVIDE BODY FOR TESTING
    console.log('result :>> ', result.data);
    setRespond(result.data);
  };

  return (
    <Box>
      <Button onClick={sendRequest}> Test Tombolo Integration</Button>
      {/* <pre>{JSON.stringify(respond, null, 2)}</pre> */}
      {respond ? (
        <Link href={respond} variant='body2'>
          {respond}
        </Link>
      ) : null}
    </Box>
  );
}

export default TestTomboloIntegration;
