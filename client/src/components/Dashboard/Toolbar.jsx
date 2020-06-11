import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar, Typography } from '@material-ui/core';
import {
  AddCircle as AddCircleIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
} from '@material-ui/icons';

// Constants
import { canAddCharts } from '../../utils/misc';

// Create styles
const useStyles = makeStyles({
  button: { margin: 'auto 10px' },
  typography: { flex: 1, fontSize: 24 },
});

const ToolbarComp = ({ dashboard, refreshChart, toggleDialog, toggleDrawer, toggleShare }) => {
  const { name, role } = dashboard;
  const { button, typography } = useStyles();

  return (
    <Toolbar>
      <Typography variant='h2' color='inherit' className={typography}>
        {name}
      </Typography>
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
  );
};

export default ToolbarComp;
