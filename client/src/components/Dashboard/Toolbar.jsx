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
import { canAddCharts } from '../../utils/misc';

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
  toggleShare,
}) => {
  const { name, role } = dashboard;
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { button, menuItem, toolbar, typography } = useStyles();

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (!anchorRef.current || !anchorRef.current.contains(event.target)) {
      return setOpen(false);
    }
  };

  // Return focus to the button when transitioned from !open -> open
  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

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
            {canAddCharts(role) ? (
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
            <Button className={button} variant='contained' color='primary' onClick={toggleShare}>
              <ShareIcon />
            </Button>
          </Toolbar>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ToolbarComp;
