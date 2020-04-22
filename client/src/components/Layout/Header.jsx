import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';

// React Components
import DashboardDrawer from '../Drawers/Dashboards';

// Redux Actions
import { getLatestUserData, logoutUser } from '../../features/auth/actions';

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

  // Check for existing token to log in user
  if (token && !userID) {
    setAuthHeader(token);
    getLatestUserData().then(action => dispatch(action));
  } else if (!token && userID) {
    setAuthHeader();
    logoutUser().then(action => dispatch(action));
  }

  const logout = () => {
    localStorage.removeItem('realBIToken');
    window.location.reload(false); // Temporary method to reload page after token is removed from browser storage
  };

  return (
    <Fragment>
      <AppBar position='static' className={appBar}>
        <Toolbar>
          {userID && (
            <IconButton edge='start' color='inherit' aria-label='menu' onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant='h6' color='inherit' className={typography}>
            REAL BI
          </Typography>
          {userID && (
            <Fragment>
              <Button color='inherit'>Settings</Button>
              <Button color='inherit' onClick={logout}>
                Logout
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
      <DashboardDrawer showDrawer={showDrawer} toggleDrawer={toggleDrawer} />
    </Fragment>
  );
};

export default Header;
