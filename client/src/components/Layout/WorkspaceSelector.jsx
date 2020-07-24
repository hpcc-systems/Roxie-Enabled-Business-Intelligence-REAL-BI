import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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

const WorkspaceSelector = ({ dispatch, user }) => {
  const { lastWorkspace, workspaces = [] } = user;
  const history = useHistory();
  const { formControl, icon, inputLabel, select } = useStyles();

  useEffect(() => {
    if (lastWorkspace) {
      const workspaceIndex = workspaces.findIndex(({ id }) => lastWorkspace === id);

      if (workspaceIndex === -1) {
        updateLastWorkspace(null).then(action => {
          dispatch(action);

          history.push('/workspace');
        });
      }
    }
  }, [dispatch, history, lastWorkspace, workspaces]);

  const selectWorkspace = async (event, workspaceID) => {
    const value = event ? event.target.value : workspaceID;

    if (value !== '') {
      updateLastWorkspace(value).then(action => {
        dispatch(action);

        history.push(`/workspace/${value}`);
      });
    }
  };

  return (
    <FormControl className={formControl}>
      <InputLabel className={inputLabel}>Workspace</InputLabel>
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
