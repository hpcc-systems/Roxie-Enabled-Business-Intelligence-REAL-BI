import React, { Fragment, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuList,
  MenuItem,
  Paper,
  Popper,
  Toolbar,
  Typography,
  Grid,
} from '@material-ui/core';
import {
  AddCircle as AddCircleIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
} from '@material-ui/icons';

// Constants
import { canAddCharts, canShareDashboard } from '../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { margin: theme.spacing(0.75) },
  menuItem: {
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    '& > a': { color: 'inherit', display: 'inherit', textDecoration: 'none' },
  },
  toolbar: { float: 'right' },
  typography: { fontSize: 24, fontWeight: 'bold', marginTop: theme.spacing(3), float: 'right' },
}));

const ToolbarComp = ({
  dashboard,
  refreshChart,
  toggleNewChartDialog,
  toggleRelationsDialog,
  toggleDrawer,
  togglePDF,
  toggleShare,
}) => {
  const { name, permission } = dashboard;
  const anchorRef = useRef(null);
  const anchorRef2 = useRef(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const { button, menuItem, toolbar, typography } = useStyles();

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleToggle2 = () => {
    setOpen2(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (!anchorRef.current || !anchorRef.current.contains(event.target)) {
      setOpen(false);
    }

    if (!anchorRef2.current || !anchorRef2.current.contains(event.target)) {
      return setOpen2(false);
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
      anchorRef2.current.focus();
    }

    prevOpen.current = open;
    prevOpen2.current = open2;
  }, [open, open2]);

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant='h2' color='inherit' className={typography} align='center'>
            {name}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Toolbar className={toolbar}>
            <Button className={button} variant='contained' color='primary' onClick={refreshChart}>
              <RefreshIcon />
            </Button>
            {canAddCharts(permission) ? (
              <Fragment>
                <Button
                  className={button}
                  variant='contained'
                  color='primary'
                  onClick={handleToggle}
                  ref={anchorRef}
                >
                  <AddCircleIcon />
                </Button>

                {/* Add Element Dropdown */}
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList autoFocusItem={open} id='addElementMenu'>
                            <MenuItem
                              className={menuItem}
                              onClick={e => {
                                handleClose(e);
                                toggleNewChartDialog();
                              }}
                            >
                              Add Chart
                            </MenuItem>
                            <MenuItem
                              className={menuItem}
                              onClick={e => {
                                handleClose(e);
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
              </Fragment>
            ) : null}
            <Button className={button} variant='contained' color='primary' onClick={toggleDrawer}>
              <FilterListIcon />
            </Button>
            <Button
              className={button}
              variant='contained'
              color='primary'
              onClick={handleToggle2}
              ref={anchorRef2}
            >
              <ShareIcon />
            </Button>

            {/* Share Element Dropdown */}
            <Popper open={open2} anchorEl={anchorRef2.current} role={undefined} transition>
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList autoFocusItem={open} id='addElementMenu'>
                        <MenuItem
                          className={menuItem}
                          onClick={e => {
                            handleClose(e);
                            togglePDF();
                          }}
                        >
                          Create PDF
                        </MenuItem>
                        {canShareDashboard(permission) && (
                          <MenuItem
                            className={menuItem}
                            onClick={e => {
                              handleClose(e);
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
          </Toolbar>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ToolbarComp;
