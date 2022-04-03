import React, { useRef, useState } from 'react';
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
import { Alert } from '@material-ui/lab';
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
    marginTop: 10,
  },
  toolbar: {
    visibility: props => (props.cluster ? 'visible' : 'hidden'),
    float: 'right',
    marginTop: theme.spacing(-6),
    [theme.breakpoints.down('sm')]: {
      float: 'none',
      margin: '0 ',
      maxWidth: '100%',
      justifyContent: 'center',
    },
  },
  typography: {
    fontSize: 24,
    fontWeight: 'bold',
    maxWidth: '40%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  typographyInfo: { margin: theme.spacing(1, 'auto') },
}));

const ToolbarComp = ({
  dashboard,
  hasInteractiveFilter,
  refreshChart,
  resetInteractiveFilter,
  toggleNewChartDialog,
  toggleRelationsDialog,
  toggleDrawer,
  // togglePDF,
  toggleShare,
  toggleSharedWith,
}) => {
  const { cluster, name, fileName, createdAt, permission: dashboardPermission, accessOnBehalf } = dashboard;

  const addButtonRef = useRef(null);
  const shareButtonRef = useRef(null);
  const infoButtonRef = useRef(null);

  const [openPopper, setOpenPopper] = useState({ add: false, share: false, info: false });

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

  const handleToggle = stateKey => setOpenPopper(prev => ({ ...prev, [stateKey]: !prev[stateKey] }));

  const dashboardCreatedAt = new Date(createdAt);

  return (
    <Container maxWidth='xl'>
      <Box display='flex' alignItems='center' mt={2} justifyContent='center' className={root}>
        <Typography variant='h2' noWrap color='inherit' className={typography} ref={infoButtonRef}>
          {name}
        </Typography>
        <IconButton className={info} onClick={() => handleToggle('info')}>
          <InfoIcon fontSize='small' />
        </IconButton>
      </Box>
      <Box display='flex' className={toolbar}>
        {hasInteractiveFilter && (
          <Tooltip title='Remove click filter' placement='top'>
            {/* Wrap button in span because Tooltip component cannot accept a child element that it disabled */}
            <span>
              <Button className={clsx(button, resetBtn)} variant='contained' onClick={resetInteractiveFilter}>
                <RotateLeftIcon />
              </Button>
            </span>
          </Tooltip>
        )}
        <Tooltip title='Refresh page' placement='top'>
          <Button className={button} variant='contained' color='primary' onClick={refreshChart}>
            <RefreshIcon />
          </Button>
        </Tooltip>
        <>
          {canAddCharts(dashboardPermission) ? (
            <Tooltip title='Add Chart/Relation' placement='top'>
              <Button
                className={button}
                variant='contained'
                color='primary'
                onClick={() => handleToggle('add')}
                ref={addButtonRef}
              >
                <AddCircleIcon />
              </Button>
            </Tooltip>
          ) : null}

          <Tooltip title='Open filter drawer' placement='top'>
            <Button className={button} variant='contained' color='primary' onClick={toggleDrawer}>
              <FilterListIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Share dashboard' placement='top'>
            <Button
              className={button}
              variant='contained'
              color='primary'
              onClick={() => handleToggle('share')}
              ref={shareButtonRef}
            >
              <ShareIcon />
            </Button>
          </Tooltip>
        </>
      </Box>
      {/* Add Element Dropdown */}
      <Popper open={openPopper.add} anchorEl={addButtonRef.current} role={undefined} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={() => handleToggle('add')}>
                <MenuList>
                  <MenuItem
                    className={menuItem}
                    onClick={() => {
                      handleToggle('add');
                      toggleNewChartDialog();
                    }}
                  >
                    Add Chart
                  </MenuItem>
                  <MenuItem
                    className={menuItem}
                    onClick={() => {
                      handleToggle('add');
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
      <Popper open={openPopper.share} anchorEl={shareButtonRef.current} role={undefined} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={() => handleToggle('share')}>
                <MenuList>
                  <MenuItem
                    className={menuItem}
                    onClick={() => {
                      handleToggle('share');
                      window.print();
                    }}
                  >
                    Create PDF
                  </MenuItem>
                  {canShareDashboard(dashboardPermission) && (
                    <MenuItem
                      className={menuItem}
                      onClick={() => {
                        handleToggle('share');
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
      <Popper open={openPopper.info} anchorEl={infoButtonRef.current} role={undefined} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
            <Paper elevation={10} classes={{ root: infoCard }}>
              <ClickAwayListener onClickAway={() => handleToggle('info')}>
                <Paper className={paper}>
                  <Typography variant='h6' align='center'>
                    Dashboard Info
                  </Typography>
                  {accessOnBehalf && (
                    <Alert variant='outlined' severity={'error'}>
                      This dashboard is using shared credentials
                    </Alert>
                  )}
                  <Typography variant='body2' className={typographyInfo}>
                    <strong>Workspace permission:</strong> {workspacePermission}
                  </Typography>
                  <Typography variant='body2' className={typographyInfo}>
                    <strong>Dashboard permission:</strong> {dashboardPermission}
                  </Typography>
                  {fileName && (
                    <Typography variant='body2' className={typographyInfo}>
                      <strong>Associated file:</strong> {fileName}
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
                      onClick={() => {
                        handleToggle('info');
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
