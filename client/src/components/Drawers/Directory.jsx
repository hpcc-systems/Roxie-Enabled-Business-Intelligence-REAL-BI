import React, { Fragment, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Typography } from '@material-ui/core';

// React Components
import DirectoryTree from './DirectoryTree';
import FavoritesTree from './FavoritesTree';
import DashboardDialog from '../Dialog/DashboardDialog';
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
  loading: false,
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

const DirectoryDrawer = ({
  changeTabIndex,
  showDrawer,
  toggleDrawer,
  editCurrentDashboard,
  setEditCurrentDashboard,
}) => {
  const { values: localState, handleChange, formFieldsUpdate } = useForm(initState);
  const [dashboardID, setDashboardID] = useState(null);
  const [folderObj, setFolderObj] = useState(null);
  const [workspace, dashboard] = useSelector(state => [state.workspace.workspace, state.dashboard.dashboard]);
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

      const clusterCredentials = dashboard.cluster ? await checkForClusterCreds(dashboard.cluster.id) : null;

      if (dashboard.permission === 'Owner') {
        if (!clusterCredentials || !dashboard.cluster) {
          return editDashboard(directoryObj);
        }
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

  const createOrUpdateClusterCreds = async form => {
    const { updateCreds, hasClusterCreds, clusterID, password, username } = form;
    if (updateCreds || !hasClusterCreds) {
      if (hasClusterCreds) {
        await updateClusterCreds({ clusterID, password, username });
      } else {
        await createClusterCreds({ clusterID, password, username });
      }
    }
  };

  const handleDashboardError = error => {
    const invalidCredsError = 'Invalid credentials, please check your username and password.';
    const otherError = 'Server error Occured';
    formFieldsUpdate({
      loading: false,
      error: error?.status === 401 ? invalidCredsError : otherError,
    });
  };

  const checkNameRestrictions = (objNames, name, entity) => {
    if (existsInArray(objNames, name.toLowerCase().trim())) {
      return `${entity} with this name already exists, please provide different name`;
    }
    if (name.length === 0) return `"${name}" is not a valid ${entity} name`;
    return null;
  };

  const createNewDashboard = async () => {
    const { name, parentID } = localState;

    const parentNode = findNodeRef(directory, parentID);
    const objNames = parentNode.children.map(el => !el.children && el.name);
    // Check for duplicate names in directory
    const nameError = checkNameRestrictions(objNames, name, 'Dashboard');
    if (nameError) return formFieldsUpdate({ error: nameError });
    let dashboard;
    try {
      formFieldsUpdate({ loading: true, error: '' });
      await createOrUpdateClusterCreds(localState);
      dashboard = await createDashboard(localState, workspaceID);
    } catch (error) {
      return handleDashboardError(error);
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
      dispatch(error);
    }
    formFieldsUpdate({ loading: false });
  };

  const updateExistingDashboard = async clickedDashboard => {
    const { clusterID, directoryObj, name } = localState;

    if (name.length === 0) return formFieldsUpdate({ error: `"${name}" is not a valid File name` });

    try {
      formFieldsUpdate({ loading: true });
      await createOrUpdateClusterCreds(localState);
      // Update directoryObj
      const newDirectoryObj = { ...directoryObj, name, clusterID };

      //check if cluster or dashname was changed if not then update creds only
      if (dashboard.name !== newDirectoryObj.name || clickedDashboard.cluster?.id !== clusterID) {
        const newDirectory = updateObjectInDirectory(directory, directoryObj.id, newDirectoryObj);

        // Update dashboard first then get refreshed workspace data
        const action = await updateDashboard(clusterID, directoryObj.id, name);
        const otherActions = await Promise.all([
          updateWorkspaceDirectory(newDirectory, workspaceID),
          getOpenDashboardsInWorkspace(workspaceID),
        ]);

        batch(() => {
          const allActions = [action, ...otherActions];
          allActions.forEach(action => dispatch(action));
        });
      }

      formFieldsUpdate({ loading: false });
      toggleEditDashboardDialog();
      openDashboard(directoryObj);
    } catch (error) {
      handleDashboardError(error);
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

    const nameError = checkNameRestrictions(objNames, name, 'Folder');
    if (nameError) return formFieldsUpdate({ error: nameError });
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

    if (name.length === 0) return formFieldsUpdate({ error: `"${name}" is not a valid File name` });

    formFieldsUpdate({ loading: true });
    // Update directoryObj
    const updatedDirectoryObj = { ...directoryObj, name };
    const newDirectory = updateObjectInDirectory(directory, updatedDirectoryObj.id, updatedDirectoryObj);
    try {
      const action = await updateWorkspaceDirectory(newDirectory, workspaceID);
      dispatch(action);
      toggleEditFolderDialog();
    } catch (error) {
      dispatch(error);
    }
    formFieldsUpdate({ loading: false });
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
    formFieldsUpdate({ parentID });
    toggleNewDashboardDialog();
  };

  const addNewFolder = parentID => {
    formFieldsUpdate({ parentID });
    toggleNewFolderDialog();
  };

  const editFolder = directoryObj => {
    const { name } = directoryObj;
    formFieldsUpdate({ name, directoryObj });
    toggleEditFolderDialog();
  };

  const removeFolder = directoryObj => {
    setFolderObj(directoryObj);
    toggleDeleteFolderDialog();
  };

  const editDashboard = async directoryObj => {
    try {
      const { payload } = await getDashboard(directoryObj.id);
      formFieldsUpdate({
        clickedDashboard: payload,
        clusterID: payload.cluster?.id || '',
        name: payload.name,
        directoryObj,
      });

      toggleEditDashboardDialog();
    } catch (error) {
      dispatch(error);
    }
  };

  const removeDashboard = dashboardID => {
    setDashboardID(dashboardID);
    toggleDeleteDashboardDialog();
  };

  React.useEffect(() => {
    if (editCurrentDashboard) {
      editDashboard(dashboard);
      setEditCurrentDashboard(false);
    }
  }, [editCurrentDashboard]);

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
        <DashboardDialog
          toggleDialog={toggleNewDashboardDialog}
          submitDashboard={createNewDashboard}
          formFieldsUpdate={formFieldsUpdate}
          show={showNewDashboardDialog}
          isEditingDashboard={false}
          localState={localState}
        />
      )}
      {showEditDashboardDialog && (
        <DashboardDialog
          submitDashboard={updateExistingDashboard}
          toggleDialog={toggleEditDashboardDialog}
          formFieldsUpdate={formFieldsUpdate}
          show={showEditDashboardDialog}
          isEditingDashboard={true}
          localState={localState}
        />
      )}
      {showNewFolderDialog && (
        <NewFolderDialog
          formFieldsUpdate={formFieldsUpdate}
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
