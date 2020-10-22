import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

// Utils
import { updateLastWorkspace } from '../../features/auth/actions';

const useStyles = makeStyles(theme => ({
  formControl: {
    width: theme.spacing(25),
    marginBottom: theme.spacing(0.5),
    marginRight: theme.spacing(1.5),
  },
  icon: { fill: theme.palette.primary.contrastText },
  inputLabel: { color: theme.palette.primary.contrastText },
  select: {
    color: grey[50],
    '&:before': {
      borderColor: theme.palette.primary.contrastText,
    },
    '&:hover': {
      borderColor: theme.palette.primary.contrastText,
    },
    '&:after': {
      borderColor: theme.palette.primary.contrastText,
    },
  },
}));

const WorkspaceSelector = () => {
  const { user = {} } = useSelector(state => state.auth);
  const { workspaces = [] } = useSelector(state => state.workspace);
  const { lastWorkspace } = user;
  const history = useHistory();
  const dispatch = useDispatch();
  const { formControl, icon, inputLabel, select } = useStyles();

  useEffect(() => {
    // Check if user has looked at a workspace previously
    if (lastWorkspace) {
      // Get index of last viewed workspace
      const workspaceIndex = workspaces.findIndex(({ id }) => lastWorkspace === id);

      // If workspace no longer exists in DB, update last workspace to null
      if (workspaceIndex === -1) {
        updateLastWorkspace(null).then(action => {
          dispatch(action);

          history.push('/workspace');
        });
      }
    }
  }, [dispatch, history, lastWorkspace, workspaces]);

  const selectWorkspace = async event => {
    const { value } = event.target;

    // User clicked on a workspace in dropdown
    if (value !== '') {
      updateLastWorkspace(value).then(action => {
        dispatch(action);

        history.push(`/workspace/${value}`);
      });
    }
  };

  const selectorLabel =
    workspaces.length === 0 ? 'Create a workspace' : !lastWorkspace ? 'Choose a workspace' : 'Workspace';

  return (
    <FormControl className={formControl}>
      <InputLabel className={inputLabel}>{selectorLabel}</InputLabel>
      <Select
        className={select}
        value={lastWorkspace || ''}
        onChange={selectWorkspace}
        inputProps={{ classes: { icon: icon } }}
      >
        {workspaces.map(({ id, name }, index) => {
          return (
            <MenuItem key={index} value={id}>
              {name}
            </MenuItem>
          );
        })}
        {workspaces.length === 0 && <MenuItem value={''}>Create a workspace</MenuItem>}
      </Select>
    </FormControl>
  );
};

export default WorkspaceSelector;
