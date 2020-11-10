import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Create styles
const useStyles = makeStyles({
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  subheader: { fontSize: 20, paddingBottom: 20 },
});

const NoData = ({ error, sourceType }) => {
  const { header, subheader } = useStyles();
  const defaultSubheaderMsg =
    sourceType === 'ecl' ? 'Execute ECL to preview chart...' : 'Check chart config and refresh...';

  return (
    <Fragment>
      <Typography variant='h3' align='center' color='inherit' className={header}>
        {error ? 'Error received' : 'No Data Received'}
      </Typography>
      <Typography variant='h3' align='center' color='inherit' className={subheader}>
        {error ? error : defaultSubheaderMsg}
      </Typography>
    </Fragment>
  );
};

export default NoData;
