import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Create styles
const useStyles = makeStyles({
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  subheader: { fontSize: 20, paddingBottom: 20 },
});

const NoData = ({ err }) => {
  const { header, subheader } = useStyles();

  return (
    <Fragment>
      <Typography variant='h3' align='center' color='inherit' className={header}>
        {err ? 'Error received from HPCC cluster' : 'No Data Received'}
      </Typography>
      <Typography variant='h3' align='center' color='inherit' className={subheader}>
        {err ? `${err.slice(0, 35)}...` : 'Check chart options and refresh...'}
      </Typography>
    </Fragment>
  );
};

export default NoData;
