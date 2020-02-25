import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';

// React Components
import Drawer from '../Drawers/Dashboards';

// Redux Actions
import { loginUser } from '../../features/auth/actions';

// React Hooks
import useDrawer from '../../hooks/useDrawer';

// Create styles
const useStyles = makeStyles(() => ({
  appBar: { marginBottom: 15 },
  typography: { flex: 1, marginLeft: 12 },
}));

const Header = () => {
  const { showDrawer, toggleDrawer } = useDrawer(false);
  const dispatch = useDispatch();
  const { appBar, typography } = useStyles();

  // Get jwt for user from back-end and store in localStorage for future data requests
  const login = async () => {
    loginUser().then(action => dispatch(action));
  };

  return (
    <Fragment>
      <AppBar position="static" className={appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={typography}>
            HPCC Dashboard
          </Typography>
          <Button color="inherit" onClick={() => login()}>
            Log In
          </Button>
          <Button color="inherit">Settings</Button>
        </Toolbar>
      </AppBar>
      <Drawer dispatch={dispatch} showDrawer={showDrawer} toggleDrawer={toggleDrawer} />
    </Fragment>
  );
};

export default Header;
