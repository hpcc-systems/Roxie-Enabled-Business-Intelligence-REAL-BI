import React from 'react';
import { Box, Button, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { debounce } from 'lodash';

const useStyles = makeStyles(theme => ({
  addClusterButton: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
}));

function AddCluster({ setEditCurrentDashboard }) {
  const classes = useStyles();

  const openEditDashboard = () => {
    setEditCurrentDashboard(true);
  };

  return (
    <Box
      component={Paper}
      display='flex'
      alignItems='center'
      variant='outlined'
      width='fit-content'
      p={3}
      m='auto'
    >
      <Typography variant='subtitle1'>There is no cluster assosiated with this dashboard</Typography>
      <Box ml={2}>
        <Button
          onClick={debounce(openEditDashboard, 500)}
          variant='contained'
          className={classes.addClusterButton}
        >
          Add cluster
        </Button>
      </Box>
    </Box>
  );
}

export default AddCluster;
