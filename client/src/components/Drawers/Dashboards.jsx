import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Drawer, Toolbar, Typography } from '@material-ui/core';
import { AddBox as AddBoxIcon, CreateNewFolder as CreateNewFolderIcon } from '@material-ui/icons';

// React Components
import DirectoryTree from './DirectoryTree';
import FavoritesTree from './FavoritesTree';
import NewDashboardDialog from '../Dialog/newDashboard';
import NewFolderDialog from '../Dialog/newFolder';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useForm from '../../hooks/useForm';

// Redux Actions
import { getDashboard } from '../../features/dashboard/actions';
import { getCharts } from '../../features/chart/actions';

// Utils
import { addDashboardToDB, getDirectory, updateDirectory } from '../../utils/dashboard';
import {
  addObjectToDirectory,
  getDashboardsFromDirectory,
  getFavoriteDashboards,
  updateDashboardObj,
} from '../../utils/directory';

const initState = { clusterID: '', directory: [], name: '', parentID: 0 };

// Create styles
const useStyles = makeStyles(theme => ({
  button: { margin: `0 ${theme.spacing(1)}px`, minWidth: 25, padding: 0 },
  drawer: { width: 'auto', minWidth: 250 },
  toolbar: { marginLeft: theme.spacing(1), paddingLeft: 0 },
  typography: { fontSize: 24, margin: theme.spacing(2), marginLeft: 0 },
}));

const DashboardDrawer = ({ showDrawer, toggleDrawer }) => {
  const { values: localState, handleChange } = useForm(initState);
  const { id: userID } = useSelector(state => state.auth.user);
  const { showDialog: showDashboardDialog, toggleDialog: toggleDashboardDialog } = useDialog(false);
  const { showDialog: showFolderDialog, toggleDialog: toggleFolderDialog } = useDialog(false);
  const dispatch = useDispatch();
  const { button, drawer, toolbar, typography } = useStyles();

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
    const { directory, parentID } = localState;
    let dashboard;

    try {
      dashboard = await addDashboardToDB(localState);
    } catch (err) {
      return console.error(err);
    }

    // Create new dashboard object
    const { userID, ...desiredKeys } = dashboard;
    const newDashboardObj = { ...desiredKeys, favorite: false };

    // Add dashboard to directory in local state and update DB
    const newDirectory = addObjectToDirectory(directory, parentID, newDashboardObj);
    updateDirectoryInDB(newDirectory);
  };

  const createFolder = () => {
    const { directory, name, parentID } = localState;
    const newFolderObj = { id: name.trim(), name: name.trim(), children: [] };

    // Add folder to directory in local state and update DB
    const newDirectory = addObjectToDirectory(directory, parentID, newFolderObj);
    updateDirectoryInDB(newDirectory);
  };

  const updateDirectoryInDB = async newDirectory => {
    try {
      // Update DB
      await updateDirectory(newDirectory);
    } catch (err) {
      return console.error(err);
    }

    // Close any open dialogs
    if (showDashboardDialog) {
      return toggleDashboardDialog();
    }

    if (showFolderDialog) {
      return toggleFolderDialog();
    }
  };

  const updateDirectoryObj = (objID, key, value) => {
    const { directory } = localState;

    // Update dashboard object in local state and update DB
    const newDirectory = updateDashboardObj(directory, objID, key, value);
    updateDirectoryInDB(newDirectory);
  };

  const addNewDashboard = parentID => {
    handleChange(null, { name: 'parentID', value: parentID });
    toggleDashboardDialog();
  };

  const addNewFolder = parentID => {
    handleChange(null, { name: 'parentID', value: parentID });
    toggleFolderDialog();
  };

  // Directory references
  const { directory } = localState;
  const dashboards = getDashboardsFromDirectory(directory, []);
  const favorites = getFavoriteDashboards(dashboards);

  return (
    <Drawer open={showDrawer} onClose={toggleDrawer}>
      <div className={drawer} role="presentation">
        <Toolbar className={toolbar}>
          <Typography className={typography}>REAL BI</Typography>
          <Button className={button} onClick={() => addNewDashboard('root')}>
            <AddBoxIcon />
          </Button>
          <Button className={button} onClick={() => addNewFolder('root')}>
            <CreateNewFolderIcon />
          </Button>
        </Toolbar>
        <FavoritesTree
          favorites={favorites}
          getDashboardInfo={getDashboardInfo}
          updateDirectoryObj={updateDirectoryObj}
        />
        <DirectoryTree
          addDashboard={addNewDashboard}
          addFolder={addNewFolder}
          directory={directory}
          getDashboardInfo={getDashboardInfo}
          handleChange={handleChange}
          toggleDashboardDialog={toggleDashboardDialog}
          toggleFolderDialog={toggleFolderDialog}
          updateDirectoryObj={updateDirectoryObj}
        />
      </div>
      {showDashboardDialog && (
        <NewDashboardDialog
          createDashboard={createDashboard}
          handleChange={handleChange}
          localState={localState}
          show={showDashboardDialog}
          toggleDialog={toggleDashboardDialog}
        />
      )}
      {showFolderDialog && (
        <NewFolderDialog
          createFolder={createFolder}
          handleChange={handleChange}
          localState={localState}
          show={showFolderDialog}
          toggleDialog={toggleFolderDialog}
        />
      )}
    </Drawer>
  );
};

export default DashboardDrawer;
