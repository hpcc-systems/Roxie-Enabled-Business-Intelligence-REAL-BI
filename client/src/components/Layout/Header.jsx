import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { AddCircle, Delete as DeleteIcon, Edit as EditIcon, Menu as MenuIcon } from '@material-ui/icons';
import classnames from 'classnames';

// React Hooks
import useDialog from '../../hooks/useDialog';

// React Components
import UserDropDown from './UserDropdown';
import WorkspaceSelector from './WorkspaceSelector';
import NewWorkspace from '../Dialog/newWorkspace';
import HelpDropDown from './HelpDropdown';
import EditWorkspace from '../Dialog/EditWorkspace';
import DeleteWorkspace from '../Dialog/DeleteWorkpace';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: theme.spacing(1.25),
    marginRight: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  buttonIcon: { marginRight: theme.spacing(0.5) },
  buttonLabel: { marginTop: theme.spacing(0.25) },
  iconBtn: { marginTop: theme.spacing(1) },
  menuIcon: { minWidth: 35, maxWidth: 35 },
  menuItem: {
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    '& > a': { color: 'inherit', display: 'inherit', textDecoration: 'none' },
  },
  menuLabel: { marginTop: theme.spacing(0.25) },
  toolbar: { minHeight: 65, maxHeight: 65 },
  typography: {
    margin: theme.spacing(0, 3, 0, 1.5),
    color: '#ff5722',
    fontWeight: 'bold',
  },
  typography2: { marginLeft: 0 },
  workspaceDiv: { flexGrow: 1 },
}));

const Header = ({ toggleDrawer }) => {
  const { user = {} } = useSelector(state => state.auth);
  const { workspaces } = useSelector(state => state.workspace);
  const { id: userID, lastViewedWorkspace, username } = user;
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const anchorRef = useRef(null);
  const anchorRef2 = useRef(null);
  const { showDialog: showNewWorkspace, toggleDialog: toggleNewWorkspace } = useDialog(false);
  const { showDialog: showEditWorkspace, toggleDialog: toggleEditWorkspace } = useDialog(false);
  const { showDialog: showDeleteWorkspace, toggleDialog: toggleDeleteWorkspace } = useDialog(false);
  const { iconBtn, toolbar, typography, typography2, workspaceDiv } = useStyles();

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

  const isChangePwdScreen = location.pathname === '/changepwd';

  return (
    <Fragment>
      <AppBar position='static'>
        <Toolbar className={toolbar}>
          {userID && !isChangePwdScreen && (
            <IconButton edge='start' color='inherit' aria-label='menu' onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant='h5'
            color='inherit'
            className={classnames(typography, { [typography2]: isChangePwdScreen })}
          >
            REAL BI
          </Typography>
          {userID && workspaces && (
            <Fragment>
              {/* Workspace Dropdown */}
              {!isChangePwdScreen ? (
                <div className={workspaceDiv}>
                  <WorkspaceSelector />
                  {lastViewedWorkspace && (
                    <Fragment>
                      <IconButton
                        edge='start'
                        color='inherit'
                        onClick={toggleEditWorkspace}
                        className={iconBtn}
                      >
                        <EditIcon fontSize='small' />
                      </IconButton>
                      <IconButton
                        edge='start'
                        color='inherit'
                        onClick={toggleDeleteWorkspace}
                        className={iconBtn}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Fragment>
                  )}
                  <IconButton edge='start' color='inherit' onClick={toggleNewWorkspace} className={iconBtn}>
                    <AddCircle fontSize='small' />
                  </IconButton>
                </div>
              ) : (
                <div style={{ flexGrow: 1 }}></div>
              )}

              <HelpDropDown
                anchorRef={anchorRef}
                handleClose={handleClose}
                handleToggle={handleToggle}
                open={open}
                useStyles={useStyles}
              />

              <UserDropDown
                anchorRef={anchorRef2}
                handleClose={handleClose}
                handleToggle={handleToggle}
                open={open2}
                username={username}
                useStyles={useStyles}
              />
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
      {showNewWorkspace && <NewWorkspace show={showNewWorkspace} toggleDialog={toggleNewWorkspace} />}
      {showEditWorkspace && <EditWorkspace show={showEditWorkspace} toggleDialog={toggleEditWorkspace} />}
      {showDeleteWorkspace && (
        <DeleteWorkspace show={showDeleteWorkspace} toggleDialog={toggleDeleteWorkspace} />
      )}
    </Fragment>
  );
};

export default Header;
