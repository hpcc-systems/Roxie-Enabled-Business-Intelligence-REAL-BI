import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Create styles
const useStyles = makeStyles({
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  subheader: { fontSize: 20, paddingBottom: 20 },
});

const NoData = () => {
  const { header, subheader } = useStyles();

  return (
    <Fragment>
      <Typography variant="h3" align="center" color="inherit" className={header}>
        No Data Received
      </Typography>
      <Typography variant="h3" align="center" color="inherit" className={subheader}>
        Check query parameters...
      </Typography>
    </Fragment>
  );
};

export default NoData;
