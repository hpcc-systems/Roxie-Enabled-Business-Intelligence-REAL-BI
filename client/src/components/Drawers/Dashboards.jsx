import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Toolbar, Typography } from '@material-ui/core';

// React Components
import DirectoryTree from './DirectoryTree';
import FavoritesTree from './FavoritesTree';
import NewDashboardDialog from '../Dialog/newDashboard';
import EditDashboardDialog from '../Dialog/editDashboard';
import NewFolderDialog from '../Dialog/newFolder';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useForm from '../../hooks/useForm';

// Redux Actions
import { updateLastDashboard } from '../../features/auth/actions';
import { GET_DASHBOARD, getDashboard } from '../../features/dashboard/actions';

// Utils
import {
  addDashboardToDB,
  deleteDashboardInDB,
  updateDashboardInDB,
  updateDirectory,
  updateDirectoryDepth,
} from '../../utils/dashboard';
import {
  addObjectToDirectory,
  getDashboardsFromDirectory,
  getFavoriteDashboards,
  removeObjFromDirectory,
  updateDashboardObj,
  updateObjectInDirectory,
} from '../../utils/directory';
import { createClusterAuth } from '../../utils/clusterAuth';

const initState = {
  clusterID: '',
  dashboardID: '',
  directoryObj: {},
  password: '',
  username: '',
  directoryDepth: ['root'],
  directory: [],
  hasClusterAuth: null,
  name: '',
  parentID: 0,
  updateCreds: false,
};

// Create styles
const useStyles = makeStyles(theme => ({
  drawer: { width: 'auto', minWidth: 250 },
  toolbar: { marginLeft: theme.spacing(1), paddingLeft: 0 },
  typography: { fontSize: 24, marginLeft: 0, textDecoration: 'underline' },
}));

const DashboardDrawer = ({ showDrawer, toggleDrawer }) => {
  const { values: localState, handleChange } = useForm(initState);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { directory: storeDirectory, directoryDepth: storeDirectoryDepth, lastDashboard } = useSelector(
    state => state.auth.user,
  );
  const { showDialog: showNewDashboardDialog, toggleDialog: toggleNewDashboardDialog } = useDialog(false);
  const { showDialog: showEditDashboardDialog, toggleDialog: toggleEditDashboardDialog } = useDialog(false);
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

  // Update last viewed dashboard and navigate to new url
  const getDashboardInfo = dashboardID => {
    history.push(`/dashboard/${dashboardID}`);
    toggleDrawer();

    updateLastDashboard(dashboardID).then(action => {
      dispatch(action);
    });
  };

  const createDashboard = async () => {
    const { clusterID, directory, directoryDepth, parentID, password, username } = localState;
    let dashboard;

    // Enable loading animation
    setLoading(true);

    try {
      dashboard = await addDashboardToDB(localState);
      createClusterAuth({ clusterID, password, username });
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

    // Disable loading animation
    setLoading(false);
  };

  const updateDashboard = async () => {
    const {
      clusterID,
      dashboardID,
      directory,
      directoryObj,
      name,
      password,
      updateCreds,
      username,
    } = localState;

    // Enable loading animation
    setLoading(true);

    try {
      updateDashboardInDB(localState);

      if (updateCreds || (username && password)) {
        createClusterAuth({ clusterID, password, username });
      }
    } catch (err) {
      return console.error(err);
    }

    // Update directoryObj
    const newDirectoryObj = { ...directoryObj, name, clusterID };

    // Update dashboard in directory for local state and update DB
    const newDirectory = updateObjectInDirectory(directory, dashboardID, newDirectoryObj);

    updateDirectoryInDB(newDirectory);
    handleChange(null, { name: 'directory', value: newDirectory });

    // Disable loading animation
    setLoading(false);
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
    if (showNewDashboardDialog) {
      return toggleNewDashboardDialog();
    }

    if (showEditDashboardDialog) {
      return toggleEditDashboardDialog();
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
    toggleNewDashboardDialog();
  };

  const addNewFolder = parentID => {
    handleChange(null, { name: 'parentID', value: parentID });
    toggleFolderDialog();
  };

  const editDashboard = directoryObj => {
    const { id: dashboardID } = directoryObj;

    getDashboard(dashboardID).then(action => {
      const { clusterID, name, id: dashboardID } = action.payload;

      // Update local state
      handleChange(null, { name: 'clusterID', value: clusterID });
      handleChange(null, { name: 'dashboardID', value: dashboardID });
      handleChange(null, { name: 'name', value: name });
      handleChange(null, { name: 'directoryObj', value: directoryObj });

      // Open edit dashboard dialog
      toggleEditDashboardDialog();
    });
  };

  const deleteDashboard = dashboardID => {
    const { directory } = localState;

    const newDirectory = removeObjFromDirectory(directory, dashboardID);
    deleteDashboardInDB(dashboardID);
    updateDirectoryInDB(newDirectory);
    handleChange(null, { name: 'directory', value: newDirectory });

    // Dashboard being deleted is the last dashboard viewed
    if (lastDashboard === dashboardID) {
      // Clear dashboard data to prevent errors
      updateLastDashboard(null).then(action => {
        batch(() => {
          dispatch(action);
          dispatch({ type: GET_DASHBOARD, payload: {} });
        });

        // Update URL
        history.push('/dashboard');
      });
    }
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
          deleteDashboard={deleteDashboard}
          editDashboard={editDashboard}
          getDashboardInfo={getDashboardInfo}
          getDirectoryDepth={getDirectoryDepth}
          localState={localState}
          updateDirectoryObj={updateDirectoryObj}
        />
      </div>
      {showNewDashboardDialog && (
        <NewDashboardDialog
          createDashboard={createDashboard}
          handleChange={handleChange}
          localState={localState}
          loading={loading}
          show={showNewDashboardDialog}
          toggleDialog={toggleNewDashboardDialog}
        />
      )}
      {showEditDashboardDialog && (
        <EditDashboardDialog
          handleChange={handleChange}
          localState={localState}
          loading={loading}
          show={showEditDashboardDialog}
          toggleDialog={toggleEditDashboardDialog}
          updateDashboard={updateDashboard}
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
