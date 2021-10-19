import React from 'react';
import { Typography, Paper, Grid, Box } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import GraphEdgesSettings from './GraphEdgesSettings';
import GraphNodeSettings from './GraphNodesSettings';

const useStyles = makeStyles(() => ({
  textColor: {
    color: '#ffffff',
  },
}));

function GraphParams(props) {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Box component={Paper} bgcolor='#6c757d' p={1} mt={2}>
        <Typography variant='body1' className={classes.textColor}>
          Create Nodes:
        </Typography>
        <GraphNodeSettings {...props} />
      </Box>

      <Box component={Paper} bgcolor='#6c757d' p={1} mt={2}>
        <Typography variant='body1' className={classes.textColor}>
          Define nodes relations:
        </Typography>
        <GraphEdgesSettings {...props} />
      </Box>
    </Grid>
  );
}

export default GraphParams;
