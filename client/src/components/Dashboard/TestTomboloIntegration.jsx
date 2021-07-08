import React, { useState } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

function TestTomboloIntegration() {
  const [respond, setRespond] = useState(null);
  const sendRequest = async () => {
    const result = await axios.post('/api/v1/tombolo', { name: 'tombolotest' });
    console.log('result :>> ', result.data);
    setRespond(result.data);
  };
  return (
    <Box>
      <Button onClick={sendRequest}> Test Tombolo Integration</Button>
      <pre>{JSON.stringify(respond, null, 2)}</pre>
    </Box>
  );
}

export default TestTomboloIntegration;
