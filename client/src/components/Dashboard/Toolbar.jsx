import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Button,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuList,
  MenuItem,
  Paper,
  Popper,
  Typography,
  Tooltip,
  Box,
} from '@material-ui/core';
import {
  AddCircle as AddCircleIcon,
  FilterList as FilterListIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  RotateLeft as RotateLeftIcon,
  Share as ShareIcon,
} from '@material-ui/icons';
import clsx from 'clsx';

// Constants
import { canAddCharts, canShareDashboard } from '../../utils/misc';
import { useSelector } from 'react-redux';

// Create styles
const useStyles = makeStyles(theme => ({
  root: {
    visibility: props => (props.cluster ? 'visible' : 'hidden'),
  },
  button: { margin: theme.spacing(0.75) },
  info: { display: 'block' },
  infoCard: { marginTop: theme.spacing(1) },
  menuItem: {
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    '& > a': {
      color: 'inherit',
      display: 'inherit',
      textDecoration: 'none',
    },
  },
  paper: { padding: theme.spacing(1, 3, 1.5, 3) },
  resetBtn: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },
  shareBtn: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
  toolbar: {
    visibility: props => (props.cluster ? 'visible' : 'hidden'),
    float: 'right',
    marginTop: theme.spacing(-6),
  },
  typography: {
    fontSize: 24,
    fontWeight: 'bold',
    maxWidth: '40%',
  },
  typographyInfo: { margin: `${theme.spacing(1)}px auto` },
}));

const ToolbarComp = ({
  dashboard,
  dataFetchInProgress,
  hasInteractiveFilter,
  refreshChart,
  resetInteractiveFilter,
  toggleNewChartDialog,
  toggleRelationsDialog,
  toggleDrawer,
  togglePDF,
  toggleShare,
  toggleSharedWith,
}) => {
  const { cluster, name, fileName, createdAt, permission: dashboardPermission } = dashboard;
  const anchorRef = useRef(null);
  const anchorRef2 = useRef(null);
  const anchorRef3 = useRef(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const {
    root,
    button,
    info,
    infoCard,
    menuItem,
    paper,
    resetBtn,
    shareBtn,
    toolbar,
    typography,
    typographyInfo,
  } = useStyles({ cluster });

  const workspacePermission = useSelector(({ workspace }) => workspace.workspace.permission);

  const handleToggle = num => {
    switch (num) {
      case 2:
        return setOpen2(prevState => !prevState);
      case 3:
        return setOpen3(prevState => !prevState);
      default:
        return setOpen(prevState => !prevState);
    }
  };

  const handleClose = (event, num) => {
    switch (num) {
      case 2:
        if (!anchorRef2.current || !anchorRef2.current.contains(event.target)) {
          setOpen2(false);
        }
        break;
      case 3:
        if (!anchorRef3.current || !anchorRef3.current.contains(event.target)) {
          setOpen3(false);
        }
        break;
      default:
        if (!anchorRef.current || !anchorRef.current.contains(event.target)) {
          setOpen(false);
        }
    }
  };

  // Return focus to the button when transitioned from !open -> open
  const prevOpen = useRef(open);
  const prevOpen2 = useRef(open2);
  const prevOpen3 = useRef(open3);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    if (prevOpen2.current === true && open2 === false) {
      anchorRef2.current.focus();
    }

    if (prevOpen3.current === true && open3 === false) {
      anchorRef3.current.focus();
    }

    prevOpen.current = open;
    prevOpen2.current = open2;
    prevOpen3.current = open3;
  }, [open, open2, open3]);

  const dashboardCreatedAt = new Date(createdAt);

  return (
    <Container maxWidth='xl'>
      <Box display='flex' alignItems='center' mt={2} justifyContent='center' className={root}>
        <Typography variant='h2' noWrap color='inherit' className={typography} ref={anchorRef3}>
          {name}
        </Typography>
        <IconButton className={info} onClick={() => handleToggle(3)}>
          <InfoIcon fontSize='small' />
        </IconButton>
      </Box>
      <Box display='flex' className={toolbar}>
        {hasInteractiveFilter && (
          <Tooltip title='Remove click filter' placement='bottom'>
            {/* Wrap button in span because Tooltip component cannot accept a child element that it disabled */}
            <span>
              <Button
                className={clsx(button, resetBtn)}
                variant='contained'
                onClick={resetInteractiveFilter}
                disabled={dataFetchInProgress}
              >
                <RotateLeftIcon />
              </Button>
            </span>
          </Tooltip>
        )}
        <Tooltip title='Refresh page' placement='bottom'>
          <Button className={button} variant='contained' color='primary' onClick={refreshChart}>
            <RefreshIcon />
          </Button>
        </Tooltip>
        <>
          {canAddCharts(dashboardPermission) ? (
            <Tooltip title='Add Chart/Relation' placement='bottom'>
              <Button
                className={button}
                variant='contained'
                color='primary'
                onClick={() => handleToggle(1)}
                ref={anchorRef}
              >
                <AddCircleIcon />
              </Button>
            </Tooltip>
          ) : null}
          <Tooltip title='Open filter drawer' placement='bottom'>
            <Button className={button} variant='contained' color='primary' onClick={toggleDrawer}>
              <FilterListIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Share dashboard' placement='bottom'>
            <Button
              className={button}
              variant='contained'
              color='primary'
              onClick={() => handleToggle(2)}
              ref={anchorRef2}
            >
              <ShareIcon />
            </Button>
          </Tooltip>
        </>
      </Box>
      {/* Add Element Dropdown */}
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={e => handleClose(e, 1)}>
                <MenuList autoFocusItem={open}>
                  <MenuItem
                    className={menuItem}
                    onClick={e => {
                      handleClose(e, 1);
                      toggleNewChartDialog();
                    }}
                  >
                    Add Chart
                  </MenuItem>
                  <MenuItem
                    className={menuItem}
                    onClick={e => {
                      handleClose(e, 1);
                      toggleRelationsDialog();
                    }}
                  >
                    Add Relation
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {/* Share Element Dropdown */}
      <Popper open={open2} anchorEl={anchorRef2.current} role={undefined} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={e => handleClose(e, 2)}>
                <MenuList autoFocusItem={open}>
                  <MenuItem
                    className={menuItem}
                    onClick={e => {
                      handleClose(e, 2);
                      togglePDF();
                    }}
                  >
                    Create PDF
                  </MenuItem>
                  {canShareDashboard(dashboardPermission) && (
                    <MenuItem
                      className={menuItem}
                      onClick={e => {
                        handleClose(e, 2);
                        toggleShare();
                      }}
                    >
                      Share Dashboard
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {/* Dashboard Info Dropdown */}
      <Popper open={open3} anchorEl={anchorRef3.current} role={undefined} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
            <Paper elevation={10} classes={{ root: infoCard }}>
              <ClickAwayListener onClickAway={e => handleClose(e, 3)}>
                <Paper className={paper}>
                  <Typography variant='h6' align='center'>
                    Dashboard Info
                  </Typography>
                  <Typography variant='body2' className={typographyInfo}>
                    <strong>Workspace permission:</strong> {workspacePermission}
                  </Typography>
                  <Typography variant='body2' className={typographyInfo}>
                    <strong>Dashboard permission:</strong> {dashboardPermission}
                  </Typography>
                  {fileName && (
                    <Typography variant='body2' className={typographyInfo}>
                      <strong>Assosiated file:</strong> {fileName}
                    </Typography>
                  )}
                  <Typography variant='body2' className={typographyInfo}>
                    <strong>Created at: </strong>
                    {dashboardCreatedAt.toDateString()} <br />
                    {dashboardCreatedAt.toTimeString()}
                  </Typography>
                  <Typography variant='body2' className={typographyInfo}>
                    <strong>Cluster Name:</strong> {cluster?.name}
                  </Typography>
                  <Typography variant='body2' className={typographyInfo}>
                    <strong>Cluster Host:</strong> {cluster?.host}
                  </Typography>
                  {dashboardPermission === 'Owner' && (
                    <Button
                      variant='contained'
                      fullWidth
                      className={shareBtn}
                      onClick={e => {
                        handleClose(e, 3);
                        toggleSharedWith();
                      }}
                    >
                      View Shared
                    </Button>
                  )}
                </Paper>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Container>
  );
};

export default ToolbarComp;
