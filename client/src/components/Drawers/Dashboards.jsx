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
import EditFolderDialog from '../Dialog/editFolder';

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
  const { showDialog: showNewFolderDialog, toggleDialog: toggleNewFolderDialog } = useDialog(false);
  const { showDialog: showEditFolderDialog, toggleDialog: toggleEditFolderDialog } = useDialog(false);
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
    const { clusterID, directory, directoryObj, name, password, updateCreds, username } = localState;

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
    const newDirectory = updateObjectInDirectory(directory, directoryObj.id, newDirectoryObj);

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

  const updateFolder = () => {
    const { directory, directoryDepth, directoryObj, name } = localState;

    // Enable loading animation
    setLoading(true);

    // Update directoryObj and directoryDepth
    const newDirectoryObj = { ...directoryObj, id: name, name };
    const directoryIndex = directoryDepth.indexOf(directoryObj.name);
    const newDepthArr = directoryDepth;

    // Replace name in depth array
    newDepthArr.splice(directoryIndex, 1, name);

    // Update dashboard in directory for local state and update DB
    const newDirectory = updateObjectInDirectory(directory, directoryObj.id, newDirectoryObj);

    updateDirectoryInDB(newDirectory);
    updateDirectoryDepth(newDepthArr);
    handleChange(null, { name: 'directory', value: newDirectory });
    handleChange(null, { name: 'directoryDepth', value: newDepthArr });

    // Disable loading animation
    setLoading(false);
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

    if (showNewFolderDialog) {
      return toggleNewFolderDialog();
    }

    if (showEditFolderDialog) {
      return toggleEditFolderDialog();
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
    toggleNewFolderDialog();
  };

  const editFolder = directoryObj => {
    const { name } = directoryObj;

    // Update local state
    handleChange(null, { name: 'name', value: name });
    handleChange(null, { name: 'directoryObj', value: directoryObj });

    // Open edit folder dialog
    toggleEditFolderDialog();
  };

  const deleteFolder = directoryObj => {
    const { directory } = localState;
    const { children = false, id: folderID } = directoryObj;

    const newDirectory = removeObjFromDirectory(directory, folderID);
    updateDirectoryInDB(newDirectory);
    handleChange(null, { name: 'directory', value: newDirectory });

    const dashboardIndex = children ? children.findIndex(({ id }) => id === lastDashboard) : -1;

    // Delete dashboards from DB if in folder
    if (children) {
      deleteNestedDashboards(children);
    }

    // Folder being deleted contains the last dashboard viewed
    if (dashboardIndex > -1) {
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

  const deleteNestedDashboards = arr => {
    const newArr = new Array(...arr);

    newArr.forEach(row => {
      const { children = false, id = false } = row;

      if (id && !children) {
        deleteDashboardInDB(id);
      } else if (children) {
        deleteNestedDashboards(children);
      }
    });
  };

  const editDashboard = directoryObj => {
    getDashboard(directoryObj.id).then(action => {
      const { clusterID, name } = action.payload;

      // Update local state
      handleChange(null, { name: 'clusterID', value: clusterID });
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
          deleteFolder={deleteFolder}
          editDashboard={editDashboard}
          editFolder={editFolder}
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
      {showNewFolderDialog && (
        <NewFolderDialog
          createFolder={createFolder}
          handleChange={handleChange}
          localState={localState}
          show={showNewFolderDialog}
          toggleDialog={toggleNewFolderDialog}
        />
      )}
      {showEditFolderDialog && (
        <EditFolderDialog
          editFolder={editFolder}
          handleChange={handleChange}
          localState={localState}
          show={showEditFolderDialog}
          toggleDialog={toggleEditFolderDialog}
          updateFolder={updateFolder}
        />
      )}
    </Drawer>
  );
};

export default DashboardDrawer;
