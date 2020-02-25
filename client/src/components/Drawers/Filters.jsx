import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Typography } from '@material-ui/core';

// Create styles
const useStyles = makeStyles(() => ({
  drawer: { width: 'auto', minWidth: 250 },
  typography: { margin: '10px 0 15px 15px' },
}));

const FilterDrawer = ({ showDrawer, toggleDrawer }) => {
  const { drawer, typography } = useStyles();

  return (
    <Drawer open={showDrawer} onClose={toggleDrawer} anchor="right">
      <div className={drawer} role="presentation">
        <Typography variant="h6" align="left" color="inherit" className={typography}>
          Query Filters
        </Typography>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
