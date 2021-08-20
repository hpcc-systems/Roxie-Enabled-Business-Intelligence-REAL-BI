import React, { Fragment, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Typography } from '@material-ui/core';

// React Components
import DirectoryTree from './DirectoryTree';
import FavoritesTree from './FavoritesTree';
import NewDashboardDialog from '../Dialog/newDashboard';
import EditDashboardDialog from '../Dialog/editDashboard';
import NewFolderDialog from '../Dialog/newFolder';
import EditFolderDialog from '../Dialog/editFolder';
import DeleteDashboardDialog from '../Dialog/DeleteDashboard';
import DeleteFolderDialog from '../Dialog/DeleteFolder';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useForm from '../../hooks/useForm';

// Redux Actions
import { getDashboard, updateDashboard } from '../../features/dashboard/actions';
import {
  getOpenDashboardsInWorkspace,
  openDashboardInWorkspace,
  updateWorkspaceDirectory,
} from '../../features/workspace/actions';

// Utils
import { createDashboard } from '../../utils/dashboard';
import {
  addObjectToDirectory,
  getDashboardsFromDirectory,
  getDirectoryDepth,
  getFavoriteDashboards,
  updateDashboardObj,
  updateFolderOpen,
  updateObjectInDirectory,
} from '../../utils/directory';
import { checkForClusterCreds, createClusterCreds, updateClusterCreds } from '../../utils/clusterCredentials';
import { existsInArray } from '../../utils/misc';
import { v4 as uuidv4 } from 'uuid';

const initState = {
  clusterID: '',
  directoryObj: {},
  error: '',
  password: '',
  username: '',
  hasClusterCreds: null,
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
    paddingBottom: 80,
    '&::-webkit-scrollbar': {
      width: '0' /* Remove scrollbar space */,
    },
  },
  typography: {
    color: theme.palette.primary.contrastText,
    marginTop: theme.spacing(2),
  },
}));

const DirectoryDrawer = ({ changeTabIndex, showDrawer, toggleDrawer }) => {
  const { values: localState, handleChange } = useForm(initState);
  const [loading, setLoading] = useState(false);
  const [dashboardID, setDashboardID] = useState(null);
  const [folderObj, setFolderObj] = useState(null);
  const { workspace } = useSelector(state => state.workspace);
  const { directory = [], id: workspaceID } = workspace;
  const dispatch = useDispatch();
  const [showNewDashboardDialog, toggleNewDashboardDialog] = useDialog(false);
  const [showEditDashboardDialog, toggleEditDashboardDialog] = useDialog(false);
  const [showNewFolderDialog, toggleNewFolderDialog] = useDialog(false);
  const [showEditFolderDialog, toggleEditFolderDialog] = useDialog(false);
  const [showDeleteFolderDialog, toggleDeleteFolderDialog] = useDialog(false);
  const [showDeleteDashboardDialog, toggleDeleteDashboardDialog] = useDialog(false);
  const { drawer, drawerPaper, typography } = useStyles();

  // Update directory depth localState
  const updateDirectoryDepth = async nodesArr => {
    const newDirectory = nodesArr.length >= 1 ? updateFolderOpen(directory, nodesArr) : directory;

    try {
      const action = await updateWorkspaceDirectory(newDirectory, workspaceID);
      dispatch(action);
    } catch (error) {
      dispatch(error);
    }
  };

  const openDashboard = async directoryObj => {
    try {
      const { payload: dashboard } = await getDashboard(directoryObj.id);
      const clusterCredentials = await checkForClusterCreds(dashboard.cluster.id);
      if (!clusterCredentials) {
        return editDashboard(directoryObj);
      }
      const action = await openDashboardInWorkspace(directoryObj.id, workspaceID);
      const tabIndex = action.payload.findIndex(openDashboard => openDashboard.id === directoryObj.id);
      dispatch(action);
      changeTabIndex(null, parseInt(tabIndex));
      toggleDrawer();
    } catch (error) {
      dispatch(error);
    }
  };

  const createNewDashboard = async () => {
    const { clusterID, hasClusterCreds, name, parentID, password, username } = localState;

    const parentNode = findNodeRef(directory, parentID);

    const objNames = parentNode.children.map(el => !el.children && el.name);

    let dashboard;

    try {
      // Check for duplicate names in directory
      if (existsInArray(objNames, name.toLowerCase().trim())) {
        throw new Error('Name already used');
      } else if (name.length === 0) {
        throw new Error(`"${name}" is not a valid dashboard name`);
      }
    } catch (error) {
      return handleChange(null, { name: 'error', value: error.message });
    }

    try {
      setLoading(true);
      dashboard = await createDashboard(localState, workspaceID);

      if (!hasClusterCreds) {
        await createClusterCreds({ clusterID, password, username });
      }

      handleChange(null, { name: 'error', value: '' });
    } catch (error) {
      setLoading(false);
      if (error?.status === 401) {
        return handleChange(null, {
          name: 'error',
          value: 'Invalid credentials, please check your username and password.',
        });
      }
      return handleChange(null, { name: 'error', value: error.message });
    }

    // Create new dashboard object
    const newDashboardObj = {
      id: dashboard.id,
      name: dashboard.name,
      favorite: false,
      shared: false,
    };
    const newDirectory = addObjectToDirectory(directory, parentID, newDashboardObj);

    try {
      const action = await updateWorkspaceDirectory(newDirectory, workspaceID);
      dispatch(action);
      toggleNewDashboardDialog();
      openDashboard(dashboard);
    } catch (error) {
      setLoading(false);
      dispatch(error);
    }
    setLoading(false);
  };

  const updateExistingDashboard = async () => {
    const { clusterID, directoryObj, hasClusterCreds, name, password, updateCreds, username } = localState;

    try {
      if (name.length === 0) {
        throw new Error(`"${name}" is not a valid File name`);
      }
    } catch (error) {
      return handleChange(null, { name: 'error', value: error });
    }

    try {
      setLoading(true);
      // Update directoryObj
      const newDirectoryObj = { ...directoryObj, name, clusterID };
      const newDirectory = updateObjectInDirectory(directory, directoryObj.id, newDirectoryObj);

      // Update dashboard first then get refreshed workspace data
      const action = await updateDashboard(clusterID, directoryObj.id, name);
      const otherActions = await Promise.all([
        updateWorkspaceDirectory(newDirectory, workspaceID),
        getOpenDashboardsInWorkspace(workspaceID),
      ]);

      if (updateCreds || (username && password)) {
        if (hasClusterCreds) {
          await updateClusterCreds({ clusterID, password, username });
        } else {
          await createClusterCreds({ clusterID, password, username });
        }
      }

      batch(() => {
        const allActions = [action, ...otherActions];
        allActions.forEach(action => dispatch(action));
      });

      setLoading(false);
      toggleEditDashboardDialog();
      openDashboard(directoryObj);
    } catch (error) {
      setLoading(false);
      if (error?.status === 401) {
        return handleChange(null, {
          name: 'error',
          value: 'Invalid credentials, please check your username and password.',
        });
      }
      return dispatch(error);
    }
  };

  const findNodeRef = (directory, searchedId) => {
    if (searchedId === 'root')
      return {
        id: searchedId,
        name: searchedId,
        open: true,
        children: directory,
      };

    for (const node of directory) {
      if (node.id === searchedId) {
        return node;
      }
      if (node.children) {
        const found = findNodeRef(node.children, searchedId);
        if (found) return found;
      }
    }
    return null;
  };

  const createFolder = async () => {
    const { name, parentID } = localState;

    const parentNode = findNodeRef(directory, parentID);
    const objNames = parentNode.children.map(el => el.name);

    try {
      // Check for duplicate names in directory
      if (existsInArray(objNames, name.toLowerCase().trim())) {
        throw new Error('Name already used');
      } else if (name.length === 0) {
        throw new Error(`"${name}" is not a valid folder name`);
      }
    } catch (error) {
      return handleChange(null, { name: 'error', value: error.message });
    }

    const newFolderObj = { id: uuidv4(), name: name.trim(), children: [], open: false };
    const newDirectory = addObjectToDirectory(directory, parentID, newFolderObj);

    try {
      const action = await updateWorkspaceDirectory(newDirectory, workspaceID);
      dispatch(action);
      toggleNewFolderDialog();
    } catch (error) {
      dispatch(error);
    }
  };

  const updateFolder = async () => {
    const { directoryObj, name } = localState;

    try {
      // Check for compliance with RegExp
      if (name.length === 0) {
        throw new Error(`"${name}" is not a valid folder name`);
      }
    } catch (error) {
      return handleChange(null, { name: 'error', value: error });
    }

    setLoading(true);
    // Update directoryObj
    const updatedDirectoryObj = { ...directoryObj, name };
    const newDirectory = updateObjectInDirectory(directory, updatedDirectoryObj.id, updatedDirectoryObj);
    try {
      const action = await updateWorkspaceDirectory(newDirectory, workspaceID);
      dispatch(action);
      setLoading(false);
      return toggleEditFolderDialog();
    } catch (error) {
      setLoading(false);
      return dispatch(error);
    }
  };

  const updateDirectoryObj = async (objID, key, value) => {
    // Update dashboard object in local state and update DB
    const newDirectory = updateDashboardObj(directory, objID, key, value);

    try {
      const action = await updateWorkspaceDirectory(newDirectory, workspaceID);
      dispatch(action);
    } catch (error) {
      return dispatch(error);
    }
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

  const removeFolder = directoryObj => {
    setFolderObj(directoryObj);
    toggleDeleteFolderDialog();
  };

  const editDashboard = async directoryObj => {
    try {
      const { payload } = await getDashboard(directoryObj.id);

      const { cluster, name } = payload;

      handleChange(null, { name: 'clusterID', value: cluster.id });
      handleChange(null, { name: 'name', value: name });
      handleChange(null, { name: 'directoryObj', value: directoryObj });

      toggleEditDashboardDialog();
    } catch (error) {
      dispatch(error);
    }
  };

  const removeDashboard = dashboardID => {
    setDashboardID(dashboardID);
    toggleDeleteDashboardDialog();
  };

  // Directory references
  const dashboards = getDashboardsFromDirectory(directory, []);
  const directoryDepth = getDirectoryDepth(directory, []);
  const favorites = getFavoriteDashboards(dashboards);

  // Add root to directory depth
  directoryDepth.unshift('root');

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
              directory={directory}
              directoryDepth={directoryDepth}
              editDashboard={editDashboard}
              editFolder={editFolder}
              openDashboard={openDashboard}
              removeDashboard={removeDashboard}
              removeFolder={removeFolder}
              updateDirectoryObj={updateDirectoryObj}
              updateDirectoryDepth={updateDirectoryDepth}
              workspace={workspace}
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
          handleChange={handleChange}
          localState={localState}
          show={showEditFolderDialog}
          toggleDialog={toggleEditFolderDialog}
          updateFolder={updateFolder}
        />
      )}
      {showDeleteFolderDialog && (
        <DeleteFolderDialog
          directoryObj={folderObj}
          show={showDeleteFolderDialog}
          toggleDialog={toggleDeleteFolderDialog}
          workspace={workspace}
        />
      )}
      {showDeleteDashboardDialog && (
        <DeleteDashboardDialog
          dashboardID={dashboardID}
          show={showDeleteDashboardDialog}
          toggleDialog={toggleDeleteDashboardDialog}
          workspace={workspace}
        />
      )}
    </Drawer>
  );
};

export default DirectoryDrawer;
