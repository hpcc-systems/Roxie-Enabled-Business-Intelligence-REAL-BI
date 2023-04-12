import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

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
  const { workspaces = [], workspace: currentOpenWorkspace } = useSelector(state => state.workspace);
  const { lastViewedWorkspace } = user;
  const history = useHistory();
  const { formControl, icon, inputLabel, select } = useStyles();

  const selectWorkspace = async event => {
    const { value } = event.target;
    if (value) {
      history.push(`/workspace/${value}`);
    }
  };

  const selectorLabel =
    workspaces.length === 0
      ? 'Create a workspace'
      : !lastViewedWorkspace
      ? 'Choose a workspace'
      : 'Workspace';

  return (
    <FormControl className={formControl}>
      <InputLabel className={inputLabel}>{selectorLabel}</InputLabel>
      <Select
        className={select}
        value={currentOpenWorkspace?.id || ''}
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
        {workspaces.length === 0 && <MenuItem value=''>Create a workspace</MenuItem>}
      </Select>
    </FormControl>
  );
};

export default WorkspaceSelector;
