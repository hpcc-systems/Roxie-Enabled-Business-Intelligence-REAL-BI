import React, { Fragment } from 'react';
import { Checkbox, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Utils
import { getDashboardsFromDirectory, updateDashboardObj } from '../../../utils/directory';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  errMsg: { color: theme.palette.error.dark },
  item: { paddingLeft: 0 },
  itemText: { fontSize: '1.07rem' },
  list: { maxHeight: '25vh', overflowY: 'auto', width: '100%' },
}));

const ShareDashboards = ({ handleChange, localState }) => {
  const { directory } = localState;
  const { item, itemText, list } = useStyles();

  const handleToggle = (id, checked) => {
    const newDirectory = updateDashboardObj(localState.directory, id, 'shared', checked);
    handleChange(null, { name: 'directory', value: newDirectory });
  };

  const { errors } = localState;
  const dashboardsErr = errors.find(err => err['dashboards']);
  const dashboards = getDashboardsFromDirectory(directory, []);
  const selectedDashboards = dashboards.filter(({ shared }) => shared);

  const renderList = directoryObj => {
    const { children, id, name } = directoryObj;
    const isFolder = Boolean(children);
    const checked = selectedDashboards.findIndex(({ id: idNum }) => idNum === id) > -1;

    return (
      <ListItem
        key={id}
        role={undefined}
        dense
        button
        onClick={() => handleToggle(id, !checked)}
        className={item}
      >
        {isFolder ? (
          children.map(node => renderList(node))
        ) : (
          <Fragment>
            <ListItemIcon>
              <Checkbox edge='start' checked={checked} tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText primary={name} classes={{ primary: itemText }} />
          </Fragment>
        )}
      </ListItem>
    );
  };

  return (
    <>
      <List
        subheader={
          <ListSubheader component='div' id='nested-list-subheader'>
            Choose dashboards:
          </ListSubheader>
        }
        className={list}
      >
        {directory.map(directoryObj => renderList(directoryObj))}
      </List>
      {dashboardsErr !== undefined && <Alert severity='error'> {dashboardsErr['dashboards']}</Alert>}
    </>
  );
};

export default ShareDashboards;
