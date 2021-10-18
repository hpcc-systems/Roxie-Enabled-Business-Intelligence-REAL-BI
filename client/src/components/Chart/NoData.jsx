import React, { Fragment } from 'react';

import { Box } from '@material-ui/core';

import { Alert, AlertTitle } from '@material-ui/lab';

const NoData = ({ error, sourceType }) => {
  const defaultSubheaderMsg =
    sourceType === 'ecl' ? 'Execute ECL to preview chart...' : 'Check chart config and refresh...';

  return (
    <Fragment>
      <Box my={1}>
        {error !== '' ? (
          <Alert severity='error'>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        ) : (
          <Alert severity='info'>
            <AlertTitle> No Data Received</AlertTitle>
            {defaultSubheaderMsg}
          </Alert>
        )}
      </Box>
    </Fragment>
  );
};

export default NoData;
