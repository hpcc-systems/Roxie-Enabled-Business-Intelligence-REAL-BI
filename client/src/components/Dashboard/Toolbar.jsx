import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar, Typography, Grid } from '@material-ui/core';
import {
  AddCircle as AddCircleIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
} from '@material-ui/icons';

// Constants
import { canAddCharts } from '../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { margin: theme.spacing(0.75) },
  toolbar: { float: 'right' },
  typography: { fontSize: 24, fontWeight: 'bold', marginTop: theme.spacing(2), float: 'right' },
}));

const ToolbarComp = ({ dashboard, refreshChart, toggleDialog, toggleDrawer, toggleShare }) => {
  const { name, role } = dashboard;
  const { button, toolbar, typography } = useStyles();

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant='h2' color='inherit' className={typography} align='center'>
            {name}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Toolbar className={toolbar}>
            <Button className={button} variant='contained' color='primary' onClick={refreshChart}>
              <RefreshIcon />
            </Button>
            {canAddCharts(role) ? (
              <Button className={button} variant='contained' color='primary' onClick={toggleDialog}>
                <AddCircleIcon />
              </Button>
            ) : null}
            <Button className={button} variant='contained' color='primary' onClick={toggleDrawer}>
              <FilterListIcon />
            </Button>
            <Button className={button} variant='contained' color='primary' onClick={toggleShare}>
              <ShareIcon />
            </Button>
          </Toolbar>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ToolbarComp;
