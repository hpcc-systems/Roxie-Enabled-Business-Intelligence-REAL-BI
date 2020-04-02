import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';

// React Components
import DashboardDrawer from '../Drawers/Dashboards';

// Redux Actions
import { getLatestUserData, loginUser, logoutUser } from '../../features/auth/actions';

// React Hooks
import useDrawer from '../../hooks/useDrawer';

// Utils
import setAuthHeader from '../../utils/axiosConfig';

// Create styles
const useStyles = makeStyles(() => ({
  appBar: { marginBottom: 15 },
  typography: { flex: 1, marginLeft: 12 },
}));

const Header = () => {
  const { showDrawer, toggleDrawer } = useDrawer(false);
  const { id: userID } = useSelector(state => state.auth.user);
  const token = localStorage.getItem('realBIToken');
  const dispatch = useDispatch();
  const { appBar, typography } = useStyles();

  // Get jwt for user from back-end and store in localStorage for future data requests
  const login = async () => {
    loginUser().then(({ action, token }) => {
      setAuthHeader(token);
      dispatch(action);
    });
  };

  // Check for existing token to log in user
  if (token && !userID) {
    console.log('yes token');
    setAuthHeader(token);
    getLatestUserData().then(action => dispatch(action));
  } else if (!token && userID) {
    console.log('no token');
    setAuthHeader();
    logoutUser().then(action => dispatch(action));
  }

  return (
    <Fragment>
      <AppBar position="static" className={appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={typography}>
            REAL BI
          </Typography>
          {!userID && (
            <Button color="inherit" onClick={() => login()}>
              Log In
            </Button>
          )}
          <Button color="inherit">Settings</Button>
        </Toolbar>
      </AppBar>
      <DashboardDrawer showDrawer={showDrawer} toggleDrawer={toggleDrawer} />
    </Fragment>
  );
};

export default Header;
