import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { AddCircle, Delete as DeleteIcon, Edit as EditIcon, Menu as MenuIcon } from '@material-ui/icons';
import clsx from 'clsx';
// import TestTomboloIntegration from '../TestTomboloIntegration';
// React Hooks
import useDialog from '../../hooks/useDialog';

// React Components
import UserDropDown from './UserDropdown';
import WorkspaceSelector from './WorkspaceSelector';
import NewWorkspace from '../Dialog/newWorkspace';
import HelpDropDown from './HelpDropdown';
import EditWorkspace from '../Dialog/EditWorkspace';
import DeleteWorkspace from '../Dialog/DeleteWorkpace';
import isEmpty from 'lodash/isEmpty';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: theme.spacing(1.25),
    marginRight: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  buttonIcon: { marginRight: theme.spacing(0.5) },
  buttonLabel: {
    marginTop: theme.spacing(0.25),
    [theme.breakpoints.only('xs')]: {
      display: 'none',
    },
  },
  iconBtn: { marginTop: theme.spacing(1) },
  menuIcon: { minWidth: 35, maxWidth: 35 },
  menuItem: {
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    '& > a': { color: 'inherit', display: 'inherit', textDecoration: 'none' },
  },
  menuLabel: { marginTop: theme.spacing(0.25) },
  toolbar: {
    minHeight: 65,
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
    },
  },
  toolbarGutters: {
    [theme.breakpoints.down('md')]: {
      padding: '5px',
    },
  },
  typography: {
    margin: theme.spacing(0, 3, 0, 1.5),
    color: '#ff5722',
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0, 3, 0, 0),
    },
  },
  typography2: { marginLeft: 0 },
  userDiv: {
    order: 2,
    [theme.breakpoints.only('xs')]: {
      order: 1,
      marginLeft: 'auto',
    },
  },
  workspaceDiv: {
    flexGrow: 1,
    order: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.only('xs')]: {
      order: 2,
      paddingTop: '5px',
      borderTop: `2px solid ${theme.palette.primary.contrastText}`,
    },
  },
}));

const Header = ({ toggleDrawer }) => {
  const { user = {} } = useSelector(state => state.auth);
  const { workspace, errorObj } = useSelector(state => state.workspace);
  const { id: userID, username } = user;
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const anchorRef = useRef(null);
  const anchorRef2 = useRef(null);
  const [showNewWorkspace, toggleNewWorkspace] = useDialog(false);
  const [showEditWorkspace, toggleEditWorkspace] = useDialog(false);
  const [showDeleteWorkspace, toggleDeleteWorkspace] = useDialog(false);
  const { iconBtn, toolbar, typography, typography2, workspaceDiv, userDiv, toolbarGutters } = useStyles();

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
  const isWorkspaceOwner = workspace?.permission === 'Owner';

  return (
    <Fragment>
      <AppBar position='static'>
        <Toolbar className={toolbar} classes={{ gutters: toolbarGutters }}>
          {!isEmpty(workspace) && isEmpty(errorObj) && !isChangePwdScreen && (
            <IconButton edge='start' color='inherit' aria-label='menu' onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            display='inline'
            variant='h5'
            color='inherit'
            className={clsx(typography, { [typography2]: isChangePwdScreen })}
          >
            Roxie Enabled Business Intelligence (REAL BI)
          </Typography>

          {userID && (
            <Fragment>
              {/* Workspace Dropdown */}
              {!isChangePwdScreen ? (
                <div className={workspaceDiv}>
                  <WorkspaceSelector />
                  <div>
                    {isWorkspaceOwner && (
                      <IconButton
                        edge='start'
                        color='inherit'
                        onClick={toggleEditWorkspace}
                        className={iconBtn}
                      >
                        <EditIcon fontSize='small' />
                      </IconButton>
                    )}
                    <IconButton edge='start' color='inherit' onClick={toggleNewWorkspace} className={iconBtn}>
                      <AddCircle fontSize='small' />
                    </IconButton>

                    {workspace?.id && (
                      <IconButton
                        edge='start'
                        color='inherit'
                        onClick={toggleDeleteWorkspace}
                        className={iconBtn}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ flexGrow: 1 }}></div>
              )}
              <div className={userDiv}>
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
              </div>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
      {showNewWorkspace && <NewWorkspace show={showNewWorkspace} toggleDialog={toggleNewWorkspace} />}
      {showEditWorkspace && <EditWorkspace show={showEditWorkspace} toggleDialog={toggleEditWorkspace} />}
      {showDeleteWorkspace && (
        <DeleteWorkspace show={showDeleteWorkspace} toggleDialog={toggleDeleteWorkspace} />
      )}
      {/*------------------------------------------------ */}
      {/* send HTTP request like third party but with valid token */}
      {/* <TestTomboloIntegration /> */}
      {/*------------------------------------------------ */}
    </Fragment>
  );
};

export default Header;
