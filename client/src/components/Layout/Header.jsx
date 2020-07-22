import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  ClickAwayListener,
  Grow,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ExitToApp as ExitToAppIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  MenuBook as MenuBookIcon,
  Person as PersonIcon,
  VpnKey as VpnKeyIcon,
} from '@material-ui/icons';

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
const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: theme.spacing(1.25),
    marginRight: theme.spacing(1.25),
    paddingLeft: 0,
    paddingRight: 0,
  },
  buttonIcon: { marginRight: theme.spacing(0.5) },
  buttonLabel: { marginTop: theme.spacing(0.25) },
  menuIcon: { minWidth: 35, maxWidth: 35 },
  menuItem: {
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    '& > a': { color: 'inherit', display: 'inherit', textDecoration: 'none' },
  },
  menuLabel: { marginTop: theme.spacing(0.25) },
  toolbar: { minHeight: 54, maxHeight: 54 },
  typography: { flex: 1, marginLeft: 12, color: '#ff5722', fontWeight: 'bold' },
}));

const Header = () => {
  const { showDrawer, toggleDrawer } = useDrawer(false);
  const { id: userID, username } = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const anchorRef = useRef(null);
  const anchorRef2 = useRef(null);
  const { button, buttonIcon, buttonLabel, menuIcon, menuItem, menuLabel, toolbar, typography } = useStyles();

  const handleToggle = dropdownNum => {
    if (dropdownNum === 1) {
      setOpen(prevOpen => !prevOpen);
    } else {
      setOpen2(prevOpen2 => !prevOpen2);
    }
  };

  const handleClose = (event, dropdownNum) => {
    if (dropdownNum === 1) {
      if (!anchorRef.current || !anchorRef.current.contains(event.target)) {
        return setOpen(false);
      }
    } else {
      if (!anchorRef2.current || !anchorRef2.current.contains(event.target)) {
        return setOpen2(false);
      }
    }
  };

  // Return focus to the button when transitioned from !open -> open
  const prevOpen = useRef(open);
  const prevOpen2 = useRef(open2);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    if (prevOpen2.current === true && open2 === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
    prevOpen2.current = open2;
  }, [open, open2]);

  const logout = async () => {
    localStorage.removeItem(tokenName);
    setAuthHeader();
    dispatch(logoutUser());

    history.push('/login');
  };

  return (
    <Fragment>
      <AppBar position='static'>
        <Toolbar className={toolbar}>
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
              {/* Help Button */}
              <IconButton className={button} color='inherit' onClick={() => handleToggle(1)} ref={anchorRef}>
                <HelpIcon className={buttonIcon} />
                <Typography variant='body1' color='inherit' className={buttonLabel}>
                  Help
                </Typography>
                <ArrowDropDownIcon />
              </IconButton>

              {/* Help Dropdown */}
              <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
                    <Paper>
                      <ClickAwayListener onClickAway={event => handleClose(event, 1)}>
                        <MenuList autoFocusItem={open} id='helpMenu'>
                          <MenuItem className={menuItem} onClick={event => handleClose(event, 1)}>
                            <Link to={'/docs/User_Guide.pdf'} target='_blank'>
                              <ListItemIcon className={menuIcon}>
                                <MenuBookIcon />
                              </ListItemIcon>
                              <Typography color='inherit' className={menuLabel}>
                                User Guide
                              </Typography>
                            </Link>
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>

              {/* User Button */}
              <IconButton className={button} color='inherit' onClick={() => handleToggle(2)} ref={anchorRef2}>
                <PersonIcon className={buttonIcon} />
                <Typography variant='body1' color='inherit' className={buttonLabel}>
                  {username}
                </Typography>
                <ArrowDropDownIcon />
              </IconButton>

              {/* User Dropdown */}
              <Popper open={open2} anchorEl={anchorRef2.current} role={undefined} transition>
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
                    <Paper>
                      <ClickAwayListener onClickAway={event => handleClose(event, 2)}>
                        <MenuList autoFocusItem={open} id='userMenu'>
                          <MenuItem className={menuItem} onClick={() => console.log('Change Password')}>
                            <ListItemIcon className={menuIcon}>
                              <VpnKeyIcon />
                            </ListItemIcon>
                            <Typography color='inherit' className={menuLabel}>
                              Change Password
                            </Typography>
                          </MenuItem>
                          <MenuItem className={menuItem} onClick={() => logout()}>
                            <ListItemIcon className={menuIcon}>
                              <ExitToAppIcon />
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
          )}
        </Toolbar>
      </AppBar>
      <DashboardDrawer showDrawer={showDrawer} toggleDrawer={toggleDrawer} />
    </Fragment>
  );
};

export default Header;
