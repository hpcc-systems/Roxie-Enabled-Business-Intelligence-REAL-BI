import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Create styles
const useStyles = makeStyles(theme => ({
  header: { fontSize: 40, fontWeight: 'bold', marginTop: theme.spacing(3), marginBottom: theme.spacing(2.5) },
  subheader: { fontSize: 20 },
}));

const NoCharts = () => {
  const { header, subheader } = useStyles();

  return (
    <Fragment>
      <Typography variant='h2' align='center' color='inherit' className={header}>
        Welcome to REAL BI
      </Typography>
      <Typography variant='h2' align='center' color='inherit' className={subheader}>
        Open the left-hand menu to begin...
      </Typography>
    </Fragment>
  );
};

export default NoCharts;
