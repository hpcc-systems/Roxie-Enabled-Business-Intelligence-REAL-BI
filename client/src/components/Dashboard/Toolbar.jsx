import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import {
  AddCircle as AddCircleIcon,
  Email as EmailIcon,
  GetApp as GetAppIcon,
  Share as ShareIcon,
} from '@material-ui/icons';

// React Hooks
import useShare from '../../hooks/useShare';

// Create styles
const useStyles = makeStyles({
  menuIcon: { marginRight: 10 },
  typography: { flex: 1, fontSize: 24 },
});

const ToolbarComp = ({ name, toggleDialog }) => {
  const { menuAnchor, showMenu, hideMenu } = useShare(null);
  const { menuIcon, typography } = useStyles();

  return (
    <Toolbar>
      <Typography variant="h2" color="inherit" className={typography}>
        {name}
      </Typography>
      <Button color="primary" onClick={toggleDialog}>
        <AddCircleIcon fontSize="large" />
      </Button>
      <Button variant="contained" color="primary" onClick={showMenu}>
        <ShareIcon className={menuIcon} />
        Share
      </Button>
      <Menu anchorEl={menuAnchor} keepMounted open={Boolean(menuAnchor)} onClose={hideMenu}>
        <MenuItem onClick={hideMenu}>
          <EmailIcon className={menuIcon} />
          Email
        </MenuItem>
        <MenuItem onClick={hideMenu}>
          <GetAppIcon className={menuIcon} />
          Download PDF
        </MenuItem>
      </Menu>
    </Toolbar>
  );
};

export default ToolbarComp;
