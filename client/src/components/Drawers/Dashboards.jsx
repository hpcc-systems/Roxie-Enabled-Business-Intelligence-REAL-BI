import React from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Toolbar, Typography } from '@material-ui/core';

// React Components
import DirectoryTree from './DirectoryTree';
import FavoritesTree from './FavoritesTree';
import NewDashboardDialog from '../Dialog/newDashboard';
import NewFolderDialog from '../Dialog/newFolder';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useForm from '../../hooks/useForm';

// Redux Actions
import { updateDirectoryDepth, updateLastDashboard } from '../../features/auth/actions';
import { getDashboard } from '../../features/dashboard/actions';
import { getCharts } from '../../features/chart/actions';

// Utils
import { addDashboardToDB, updateDirectory } from '../../utils/dashboard';
import {
  addObjectToDirectory,
  getDashboardsFromDirectory,
  getFavoriteDashboards,
  updateDashboardObj,
} from '../../utils/directory';
import { useEffect } from 'react';

const initState = { clusterID: '', directoryDepth: ['root'], directory: [], name: '', parentID: 0 };

// Create styles
const useStyles = makeStyles(theme => ({
  drawer: { width: 'auto', minWidth: 250 },
  toolbar: { marginLeft: theme.spacing(1), paddingLeft: 0 },
  typography: { fontSize: 24, marginLeft: 0, textDecoration: 'underline' },
}));

const DashboardDrawer = ({ showDrawer, toggleDrawer }) => {
  const { values: localState, handleChange } = useForm(initState);
  const { directory: storeDirectory, directoryDepth: storeDirectoryDepth } = useSelector(
    state => state.auth.user,
  );
  const { showDialog: showDashboardDialog, toggleDialog: toggleDashboardDialog } = useDialog(false);
  const { showDialog: showFolderDialog, toggleDialog: toggleFolderDialog } = useDialog(false);
  const dispatch = useDispatch();
  const { drawer, toolbar, typography } = useStyles();

  // Add redux store directory to component local state
  useEffect(() => {
    handleChange(null, { name: 'directory', value: storeDirectory });
    handleChange(null, { name: 'directoryDepth', value: storeDirectoryDepth });
  }, [handleChange, storeDirectory, storeDirectoryDepth]);

  // Update directory depth localState
  const getDirectoryDepth = nodesArr => {
    updateDirectoryDepth(nodesArr);
    handleChange(null, { name: 'directoryDepth', value: nodesArr });
  };

  // Get information about specific dashboard and hide drawer
  const getDashboardInfo = dashboardID => {
    Promise.all([getDashboard(dashboardID), getCharts(dashboardID), updateLastDashboard(dashboardID)]).then(
      actions => {
        // Batch dispatch each action to only have React re-render once
        batch(() => {
          dispatch(actions[0]);
          dispatch(actions[1]);
          dispatch(actions[2]);
        });
      },
    );

    toggleDrawer();
  };

  const createDashboard = async () => {
    const { directory, directoryDepth, parentID } = localState;
    let dashboard;

    try {
      dashboard = await addDashboardToDB(localState);
    } catch (err) {
      return console.error(err);
    }

    // Create new dashboard object
    const newDashboardObj = { ...dashboard, favorite: false };
    delete newDashboardObj.userID;

    // Add dashboard to directory in local state and update DB
    const newDirectory = addObjectToDirectory(directory, parentID, newDashboardObj);
    const newDepthArr = [parentID, ...directoryDepth];

    updateDirectoryInDB(newDirectory);
    updateDirectoryDepth(newDepthArr);
    handleChange(null, { name: 'directoryDepth', value: newDepthArr });
  };

  const createFolder = () => {
    const { directory, directoryDepth, name, parentID } = localState;
    const newFolderObj = { id: name.trim(), name: name.trim(), children: [] };
    const newDepthArr = [parentID, ...directoryDepth];

    // Add folder to directory in local state and update DB
    const newDirectory = addObjectToDirectory(directory, parentID, newFolderObj);
    updateDirectoryInDB(newDirectory);
    updateDirectoryDepth(newDepthArr);
    handleChange(null, { name: 'directoryDepth', value: newDepthArr });
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
    handleChange(null, { name: 'directory', value: newDirectory });
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
  const dashboards = getDashboardsFromDirectory(localState.directory, []);
  const favorites = getFavoriteDashboards(dashboards);

  return (
    <Drawer open={showDrawer} onClose={toggleDrawer}>
      <div className={drawer} role='presentation'>
        <Toolbar className={toolbar}>
          <Typography className={typography}>REAL BI</Typography>
        </Toolbar>
        <FavoritesTree
          favorites={favorites}
          getDashboardInfo={getDashboardInfo}
          updateDirectoryObj={updateDirectoryObj}
        />
        <DirectoryTree
          addNewDashboard={addNewDashboard}
          addNewFolder={addNewFolder}
          getDashboardInfo={getDashboardInfo}
          getDirectoryDepth={getDirectoryDepth}
          localState={localState}
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
