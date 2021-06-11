import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { batch, useDispatch } from 'react-redux';
import {
  ClickAwayListener,
  Grow,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core';
import { ArrowDropDown, ExitToApp, Person, VpnKey } from '@material-ui/icons';

// Redux Actions
import { logoutUser } from '../../features/auth/actions';
import { clearWorkspaceRef } from '../../features/workspace/actions';

// Utils
import setAuthHeader from '../../utils/axiosConfig';

// Constants
import { tokenName } from '../../constants';
import { useMsal } from '@azure/msal-react';

const { REACT_APP_AUTH_METHOD } = process.env;

const UserDropDown = ({ anchorRef, handleClose, handleToggle, open, username, useStyles }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { instance } = useMsal();

  const { button, buttonIcon, buttonLabel, menuIcon, menuItem, menuLabel } = useStyles();

  const logout = async () => {
    if (REACT_APP_AUTH_METHOD === 'ADFS') {
      instance.logoutPopup({
        postLogoutRedirectUri: '/',
        mainWindowRedirectUri: '/',
      });
    } else {
      localStorage.removeItem(tokenName);
      setAuthHeader();

      Promise.all([logoutUser(), clearWorkspaceRef()]).then(actions => {
        batch(() => {
          dispatch(actions[0]);
          dispatch(actions[1]);
        });
      });

      history.push('/login');
    }
  };

  return (
    <Fragment>
      <IconButton className={button} color='inherit' onClick={() => handleToggle(2)} ref={anchorRef}>
        <Person className={buttonIcon} />
        <Typography variant='body1' color='inherit' className={buttonLabel}>
          {username}
        </Typography>
        <ArrowDropDown />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={event => handleClose(event, 2)}>
                <MenuList autoFocusItem={open} id='userMenu'>
                  {REACT_APP_AUTH_METHOD === 'ADFS' ? null : (
                    <MenuItem className={menuItem} onClick={() => history.push('/changepwd')}>
                      <ListItemIcon className={menuIcon}>
                        <VpnKey />
                      </ListItemIcon>
                      <Typography color='inherit' className={menuLabel}>
                        Change Password
                      </Typography>
                    </MenuItem>
                  )}
                  <MenuItem className={menuItem} onClick={() => logout()}>
                    <ListItemIcon className={menuIcon}>
                      <ExitToApp />
                    </ListItemIcon>
                    <Typography color='inherit' className={menuLabel}>
                      Logout
                    </Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  );
};

export default UserDropDown;
