import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Drawer,
  // List,
  // ListItem,
  // ListItemIcon,
  // ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  AddBox,
  // Dashboard as DashboardIcon
} from '@material-ui/icons';

// React Components
import DirectoryTree from './DirectoryTree';
import NewDashboardDialog from '../Dialog/newDashboard';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useForm from '../../hooks/useForm';

// Redux Actions
import { getDashboard } from '../../features/dashboard/actions';
import { getCharts } from '../../features/chart/actions';

// Utils
import { addDashboard, getDirectory, updateDirectory } from '../../utils/dashboard';

const initState = { clusterID: '', directory: [], name: '' };

// Create styles
const useStyles = makeStyles(theme => ({
  button: { minWidth: 25, padding: 0 },
  drawer: { width: 'auto', minWidth: 250 },
  msg: { fontSize: 14, margin: '10px 0 15px 18px' },
  toolbar: { marginLeft: theme.spacing(2), paddingLeft: 0 },
  typography: { margin: 15, marginLeft: 0 },
}));

const DashboardDrawer = ({ showDrawer, toggleDrawer }) => {
  const { values: localState, handleChange } = useForm(initState);
  const { id: userID } = useSelector(state => state.auth.user);
  const { showDialog, toggleDialog } = useDialog(false);
  const dispatch = useDispatch();
  const { button, drawer, msg, toolbar, typography } = useStyles();

  // Get directory tree for user
  useEffect(() => {
    if (userID) {
      getDirectory().then(data => handleChange(null, { name: 'directory', value: data }));
    }
  }, [handleChange, userID]);

  // Get information about specific dashboard and hide drawer
  const getDashboardInfo = dashboardID => {
    Promise.all([getDashboard(dashboardID), getCharts(dashboardID)]).then(actions => {
      actions.map(action => dispatch(action));
    });

    toggleDrawer();
  };

  const createDashboard = async () => {
    const { directory } = localState;
    const type = 'dashboard';
    let dashboard;

    try {
      dashboard = await addDashboard(localState);
    } catch (err) {
      return console.error(err);
    }

    // Get desired values from object and create updated directory
    const { userID, ...desiredKeys } = dashboard;
    const updatedDirectory = [...directory, { ...desiredKeys, type }];

    try {
      // Update DB
      await updateDirectory(updatedDirectory);
    } catch (err) {
      return console.error(err);
    }

    // Update local state
    handleChange(null, { name: 'directory', value: updatedDirectory });

    // Close dialog
    toggleDialog();
  };

  // Destructured reference
  const { directory } = localState;

  return (
    <Drawer open={showDrawer} onClose={toggleDrawer}>
      <div className={drawer} role="presentation">
        <Toolbar className={toolbar}>
          <Typography variant="h6" align="left" color="inherit" className={typography}>
            REAL BI
          </Typography>
          <Button className={button} onClick={toggleDialog}>
            <AddBox />
          </Button>
        </Toolbar>
        {directory.length > 0 ? (
          directory.map((directoryObj, index) => {
            return (
              <DirectoryTree
                key={index}
                directoryObj={directoryObj}
                getDashboardInfo={getDashboardInfo}
              />
            );
          })
        ) : (
          <Typography variant="h6" align="left" color="inherit" className={msg}>
            Click '+' to get started
          </Typography>
        )}
      </div>
      {showDialog && (
        <NewDashboardDialog
          createDashboard={createDashboard}
          handleChange={handleChange}
          localState={localState}
          show={showDialog}
          toggleDialog={toggleDialog}
        />
      )}
    </Drawer>
  );
};

export default DashboardDrawer;
