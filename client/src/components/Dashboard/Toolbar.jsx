import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import {
  AddCircle as AddCircleIcon,
  Email as EmailIcon,
  FilterList as FilterListIcon,
  GetApp as GetAppIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
} from '@material-ui/icons';

// React Hooks
import useShare from '../../hooks/useShare';

// Constants
import { canAddCharts } from '../../constants';

// Create styles
const useStyles = makeStyles({
  button: { margin: 'auto 10px', padding: '0 auto' },
  icon: { marginRight: 10 },
  typography: { flex: 1, fontSize: 24 },
});

const ToolbarComp = ({ dashboard, refreshChart, toggleDialog, toggleDrawer }) => {
  const { name, role } = dashboard;
  const { menuAnchor, showMenu, hideMenu } = useShare(null);
  const { button, icon, typography } = useStyles();

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
      <Button className={button} variant='contained' color='primary' onClick={showMenu}>
        <ShareIcon />
      </Button>
      <Menu anchorEl={menuAnchor} keepMounted open={Boolean(menuAnchor)} onClose={hideMenu}>
        <MenuItem onClick={hideMenu}>
          <EmailIcon className={icon} />
          Email
        </MenuItem>
        <MenuItem onClick={hideMenu}>
          <GetAppIcon className={icon} />
          Download PDF
        </MenuItem>
      </Menu>
    </Toolbar>
  );
};

export default ToolbarComp;
