import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Create styles
const useStyles = makeStyles(theme => ({
  header: { fontSize: 40, fontWeight: 'bold', marginTop: theme.spacing(3), marginBottom: theme.spacing(2.5) },
  subheader: { fontSize: 20 },
}));

const NoCharts = () => {
  const { lastWorkspace } = useSelector(state => state.auth.user);
  const { directory } = useSelector(state => state.workspace.workspace);
  const { header, subheader } = useStyles();

  const subMessage = !lastWorkspace
    ? 'Choose a workspace to begin...'
    : !directory || directory.length === 0
    ? 'Create a dashboard to begin...'
    : 'Choose a dashboard to begin...';

  return (
    <Fragment>
      <Typography variant='h2' align='center' color='inherit' className={header}>
        Welcome to REAL BI
      </Typography>
      <Typography variant='h2' align='center' color='inherit' className={subheader}>
        {subMessage}
      </Typography>
    </Fragment>
  );
};

export default NoCharts;
