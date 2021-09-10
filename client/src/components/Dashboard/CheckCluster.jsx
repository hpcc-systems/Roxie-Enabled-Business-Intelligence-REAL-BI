import React from 'react';
import { Box, Button, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  addClusterButton: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
}));

function CheckCluster({ setEditCurrentDashboard }) {
  const classes = useStyles();

  const dashboard = useSelector(state => state.dashboard.dashboard);

  const openEditDashboard = () => {
    setEditCurrentDashboard(true);
  };

  let message;
  let buttonText;

  if (!dashboard.cluster) {
    if (dashboard.permission === 'Owner') {
      message = 'There is no cluster assosiated with this dashboard';
      buttonText = 'Add cluster';
    } else {
      message = 'There are no visualizations in this dashboard';
      buttonText = null;
    }
  } else {
    message = 'Authentication to HPCC cluster failed';
    buttonText = 'Update credentials';
  }

  return (
    <Box
      component={Paper}
      display='flex'
      alignItems='center'
      variant='outlined'
      width='fit-content'
      p={3}
      mx='auto'
    >
      <Typography variant='subtitle1'>{message}</Typography>
      <Box ml={2}>
        {buttonText && (
          <Button
            onClick={debounce(openEditDashboard, 500)}
            variant='contained'
            className={classes.addClusterButton}
          >
            {buttonText}
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default CheckCluster;
