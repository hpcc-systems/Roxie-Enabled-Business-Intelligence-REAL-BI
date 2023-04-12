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
  const { lastViewedWorkspace } = useSelector(state => state.auth.user);
  const { workspace = {}, workspaces = [] } = useSelector(state => state.workspace);
  const { directory = [] } = workspace;
  const { header, subheader } = useStyles();

  const subMessage =
    !workspaces || workspaces.length === 0
      ? "Click on the 'Help' section to access the user guide."
      : !lastViewedWorkspace
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
