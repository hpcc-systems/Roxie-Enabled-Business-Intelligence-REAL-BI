import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Create styles
const useStyles = makeStyles({
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  subheader: { fontSize: 20, paddingBottom: 20 },
});

const NoData = ({ err, sourceType }) => {
  const { header, subheader } = useStyles();
  let defaultSubheaderMsg = 'Check chart config and refresh...';

  if (sourceType === 'ecl') {
    defaultSubheaderMsg = 'Execute ECL to preview chart...';
  }

  return (
    <Fragment>
      <Typography variant='h3' align='center' color='inherit' className={header}>
        {err ? 'Error received from HPCC cluster' : 'No Data Received'}
      </Typography>
      <Typography variant='h3' align='center' color='inherit' className={subheader}>
        {err ? err : defaultSubheaderMsg}
      </Typography>
    </Fragment>
  );
};

export default NoData;
