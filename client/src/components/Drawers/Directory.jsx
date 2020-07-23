import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Typography } from '@material-ui/core';

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
import { getDashboard } from '../../features/dashboard/actions';
import { openDashboardInWorkspace, updateWorkspaceDirectory } from '../../features/workspace/actions';

// Utils
import { createDashboard, deleteExistingDashboard, updateDashboard } from '../../utils/dashboard';
import {
  addObjectToDirectory,
  getDashboardsFromDirectory,
  getFavoriteDashboards,
  getObjectNames,
  removeObjFromDirectory,
  updateDashboardObj,
  updateObjectInDirectory,
} from '../../utils/directory';
import { createClusterAuth } from '../../utils/clusterAuth';
import { existsInArray } from '../../utils/misc';

// Constants
import { directoryObjNameRegexp } from '../../constants';

const initState = {
  clusterID: '',
  directoryObj: {},
  error: '',
  password: '',
  username: '',
  hasClusterAuth: null,
  name: '',
  parentID: 0,
  updateCreds: false,
};

// Create styles
const useStyles = makeStyles(theme => ({
  drawer: { width: 'auto', minWidth: 250 },
  drawerPaper: {
    backgroundColor: theme.palette.primary.main,
    marginTop: 65,
  },
  typography: {
    color: theme.palette.primary.contrastText,
    marginTop: theme.spacing(2),
  },
}));

const DirectoryDrawer = ({ showDrawer, toggleDrawer }) => {
  const { values: localState, handleChange } = useForm(initState);
  const [loading, setLoading] = useState(false);
  const { workspace } = useSelector(state => state.workspace);
  const { directory, directoryDepth, id: workspaceID } = workspace;
  const dispatch = useDispatch();
  const { showDialog: showNewDashboardDialog, toggleDialog: toggleNewDashboardDialog } = useDialog(false);
  const { showDialog: showEditDashboardDialog, toggleDialog: toggleEditDashboardDialog } = useDialog(false);
  const { showDialog: showNewFolderDialog, toggleDialog: toggleNewFolderDialog } = useDialog(false);
  const { showDialog: showEditFolderDialog, toggleDialog: toggleEditFolderDialog } = useDialog(false);
  const { drawer, drawerPaper, typography } = useStyles();

  // Update directory depth localState
  const updateDirectoryDepth = nodesArr => {
    updateWorkspaceDirectory(directory, nodesArr, workspaceID).then(action => dispatch(action));
  };

  // Open dashboard
  const openDashboard = dashboardObj => {
    openDashboardInWorkspace(dashboardObj, workspaceID).then(action => {
      dispatch(action);

      toggleDrawer();
    });
  };

  const createNewDashboard = async () => {
    const { clusterID, name, parentID, password, username } = localState;
    const objNames = getObjectNames(directory, []);
    let dashboard;

    // Check for duplicate names in directory
    if (existsInArray(objNames, name.toLowerCase().trim())) {
      const errMsg = 'Name already used';

      return handleChange(null, { name: 'error', value: errMsg });
    }

    // Enable loading animation
    setLoading(true);

    try {
      dashboard = await createDashboard(localState, workspaceID);
      await createClusterAuth({ clusterID, password, username });
    } catch (err) {
      // Disable loading animation
      setLoading(false);

      return handleChange(null, { name: 'error', value: err });
    }

    // Reset error to null
    handleChange(null, { name: 'error', value: '' });

    // Create new dashboard object
    const newDashboardObj = { ...dashboard, favorite: false };
    delete newDashboardObj.userID;

    // Add dashboard to directory in local state and update DB
    const newDirectory = addObjectToDirectory(directory, parentID, newDashboardObj);
    const newDepthArr = [parentID, ...directoryDepth];

    updateWorkspaceDirectory(newDirectory, newDepthArr, workspaceID).then(action => {
      dispatch(action);

      // Disable loading animation
      setLoading(false);

      toggleNewDashboardDialog();
    });
  };

  const updateExistingDashboard = async () => {
    const { clusterID, directoryObj, name, password, updateCreds, username } = localState;

    // Check for duplicate names in directory
    if (!directoryObjNameRegexp.test(name)) {
      const errMsg = `"${name}" is not a valid folder name`;

      return handleChange(null, { name: 'error', value: errMsg });
    }

    // Enable loading animation
    setLoading(true);

    try {
      await updateDashboard(localState);

      if (updateCreds || (username && password)) {
        createClusterAuth({ clusterID, password, username });
      }
    } catch (err) {
      // Disable loading animation
      setLoading(false);

      return handleChange(null, { name: 'error', value: err });
    }

    // Update directoryObj
    const newDirectoryObj = { ...directoryObj, name, clusterID };

    // Update dashboard in directory for local state and update DB
    const newDirectory = updateObjectInDirectory(directory, directoryObj.id, newDirectoryObj);

    updateWorkspaceDirectory(newDirectory, directoryDepth, workspaceID).then(action => {
      dispatch(action);

      // Disable loading animation
      setLoading(false);

      toggleEditDashboardDialog();
    });
  };

  const createFolder = () => {
    const { name, parentID } = localState;
    const objNames = getObjectNames(directory, []);
    let errMsg;

    // Check for duplicate names in directory
    if (existsInArray(objNames, name.toLowerCase().trim())) {
      const errMsg = 'Name already used';

      return handleChange(null, { name: 'error', value: errMsg });
    } else if (!directoryObjNameRegexp.test(name)) {
      errMsg = `"${name}" is not a valid folder name`;

      return handleChange(null, { name: 'error', value: errMsg });
    }

    const newFolderObj = { id: name.trim(), name: name.trim(), children: [] };
    const newDepthArr = [parentID, ...directoryDepth];

    // Add folder to directory
    const newDirectory = addObjectToDirectory(directory, parentID, newFolderObj);

    updateWorkspaceDirectory(newDirectory, newDepthArr, workspaceID).then(action => {
      dispatch(action);

      toggleNewFolderDialog();
    });
  };

  const updateFolder = () => {
    const { directoryObj, name } = localState;

    // Check for duplicate names in directory
    if (!directoryObjNameRegexp.test(name)) {
      const errMsg = `"${name}" is not a valid folder name`;

      return handleChange(null, { name: 'error', value: errMsg });
    }

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

    updateWorkspaceDirectory(newDirectory, newDepthArr, workspaceID).then(action => {
      dispatch(action);

      // Disable loading animation
      setLoading(false);

      toggleEditFolderDialog();
    });
  };

  const updateDirectoryObj = (objID, key, value) => {
    // Update dashboard object in local state and update DB
    const newDirectory = updateDashboardObj(directory, objID, key, value);
    updateWorkspaceDirectory(newDirectory, directoryDepth, workspaceID).then(action => dispatch(action));
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
    const { children = false, id: folderID } = directoryObj;

    const newDirectory = removeObjFromDirectory(directory, folderID);
    updateWorkspaceDirectory(newDirectory, directoryDepth, workspaceID).then(action => dispatch(action));

    // Delete dashboards from DB if in folder
    if (children) {
      deleteNestedDashboards(children);
    }
  };

  const deleteNestedDashboards = arr => {
    const newArr = new Array(...arr);

    newArr.forEach(row => {
      const { children = false, id = false } = row;

      if (id && !children) {
        deleteExistingDashboard(id);
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
    const newDirectory = removeObjFromDirectory(directory, dashboardID);
    deleteExistingDashboard(dashboardID);
    updateWorkspaceDirectory(newDirectory, directoryDepth, workspaceID).then(action => dispatch(action));
  };

  // Directory references
  const dashboards = getDashboardsFromDirectory(directory, []);
  const favorites = getFavoriteDashboards(dashboards);

  return (
    <Drawer open={showDrawer} onClose={toggleDrawer} classes={{ paper: drawerPaper }} variant='temporary'>
      <div className={drawer}>
        {Object.keys(workspace).length > 0 ? (
          <Fragment>
            <FavoritesTree
              favorites={favorites}
              openDashboard={openDashboard}
              updateDirectoryObj={updateDirectoryObj}
            />
            <DirectoryTree
              addNewDashboard={addNewDashboard}
              addNewFolder={addNewFolder}
              deleteDashboard={deleteDashboard}
              deleteFolder={deleteFolder}
              directory={directory}
              directoryDepth={directoryDepth}
              editDashboard={editDashboard}
              editFolder={editFolder}
              openDashboard={openDashboard}
              updateDirectoryObj={updateDirectoryObj}
              updateDirectoryDepth={updateDirectoryDepth}
            />
          </Fragment>
        ) : (
          <Typography className={typography} align='center'>
            Please choose a workspace
          </Typography>
        )}
      </div>
      {showNewDashboardDialog && (
        <NewDashboardDialog
          createDashboard={createNewDashboard}
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
          updateDashboard={updateExistingDashboard}
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

export default DirectoryDrawer;
