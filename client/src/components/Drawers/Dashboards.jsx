import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { AddBox, Dashboard as DashboardIcon } from '@material-ui/icons';

// React Components
import NewDashboardDialog from '../Dialog/newDashboard';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useForm from '../../hooks/useForm';

// Redux Actions
import { addDashboard, getDashboard, getDashboards } from '../../features/dashboard/actions';
import { getCharts } from '../../features/chart/actions';

const initState = { clusterID: '', name: '' };

// Create styles
const useStyles = makeStyles(theme => ({
  button: { minWidth: 25, padding: 0 },
  drawer: { width: 'auto', minWidth: 250 },
  msg: { fontSize: 14, margin: '10px 0 15px 15px' },
  toolbar: { marginLeft: theme.spacing(2), paddingLeft: 0 },
  typography: { flex: 1, margin: 15, marginLeft: 0 },
}));

const DashboardDrawer = ({ dispatch, showDrawer, toggleDrawer }) => {
  const [dashboardsLoading, setDashboardsLoading] = useState(true);
  const [newDashboardLoading, setNewDashboardLoading] = useState(false);
  const {
    values: { clusterID, name },
    handleChange,
    resetState,
  } = useForm(initState);
  const { dashboards } = useSelector(state => state.dashboard);
  const { showDialog, toggleDialog } = useDialog(false);
  const { button, drawer, msg, toolbar, typography } = useStyles();

  // ComponentDidMount -> Get list of dashboards from database
  useEffect(() => {
    getDashboards().then(action => {
      dispatch(action);
      setDashboardsLoading(false);
    });
  }, [dispatch]);

  // Get information about specific dashboard and hide drawer
  const getDashboardInfo = dashboardID => {
    Promise.all([getDashboard(dashboardID), getCharts(dashboardID)]).then(actions => {
      actions.map(action => dispatch(action));
    });

    toggleDrawer();
  };

  // Add dashboard to database and hide dialog
  const newDashboard = () => {
    setNewDashboardLoading(true);

    addDashboard({ clusterID, name }).then(action => {
      dispatch(action);
      setNewDashboardLoading(false);
    });

    toggleDialog();
  };

  // Reset state and hide dialog
  const resetDialog = () => {
    toggleDialog();
    return resetState(initState);
  };

  return (
    <Drawer open={showDrawer} onClose={toggleDrawer}>
      <div className={drawer} role="presentation">
        <Toolbar className={toolbar}>
          <Typography variant="h6" align="left" color="inherit" className={typography}>
            HPCC Dashboard
          </Typography>
          <Button className={button} onClick={toggleDialog}>
            <AddBox />
          </Button>
        </Toolbar>
        {dashboardsLoading ? (
          <CircularProgress />
        ) : (
          <List component="nav">
            {dashboards.length > 0 ? (
              dashboards.map(({ id, name }, index) => {
                return (
                  <ListItem key={index} button onClick={() => getDashboardInfo(id)}>
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                );
              })
            ) : (
              <Typography variant="h6" align="left" color="inherit" className={msg}>
                Click '+' to add a dashbaord
              </Typography>
            )}
          </List>
        )}
      </div>
      <NewDashboardDialog
        clusterID={clusterID}
        dispatch={dispatch}
        handleChange={handleChange}
        name={name}
        newDashboard={newDashboard}
        newDashboardLoading={newDashboardLoading}
        resetDialog={resetDialog}
        show={showDialog}
      />
    </Drawer>
  );
};

export default DashboardDrawer;
