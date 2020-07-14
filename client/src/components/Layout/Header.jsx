import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';

// Redux Axtions
import { logoutUser } from '../../features/auth/actions';

// React Components
import DashboardDrawer from '../Drawers/Dashboards';

// React Hooks
import useDrawer from '../../hooks/useDrawer';

// Utils
import setAuthHeader from '../../utils/axiosConfig';

// Constants
import { tokenName } from '../../constants';

// Create styles
const useStyles = makeStyles(() => ({
  typography: { flex: 1, marginLeft: 12, color: '#ff5722', fontWeight: 'bold' },
}));

const Header = () => {
  const { showDrawer, toggleDrawer } = useDrawer(false);
  const { id: userID } = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const { typography } = useStyles();

  const logout = async () => {
    localStorage.removeItem(tokenName);
    setAuthHeader();
    dispatch(logoutUser());

    history.push('/login');
  };

  return (
    <Fragment>
      <AppBar position='static'>
        <Toolbar>
          {userID && (
            <IconButton edge='start' color='inherit' aria-label='menu' onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant='h5' color='inherit' className={typography}>
            REAL BI
          </Typography>
          {userID && (
            <Fragment>
              <Button color='inherit'>Settings</Button>
              <Button color='inherit' onClick={() => logout()}>
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
