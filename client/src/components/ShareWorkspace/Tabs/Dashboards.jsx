import React, { Fragment } from 'react';
import { Checkbox, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Utils
import { getDashboardsFromDirectory, updateDashboardObj } from '../../../utils/directory';

const useStyles = makeStyles(theme => ({
  dialogText: { fontSize: '0.85rem', marginTop: theme.spacing(1.5) },
  errMsg: { color: theme.palette.error.dark },
  item: { paddingLeft: 0 },
  itemText: { fontSize: '1.07rem' },
  list: { maxHeight: '25vh', overflowY: 'auto', width: '100%' },
}));

const ShareDashboards = ({ handleChange, localState }) => {
  const { directory } = localState;
  const { dialogText, errMsg, item, itemText, list } = useStyles();

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
    <Fragment>
      <Typography className={dialogText}>
        Choose which dashboards you wish to share from this workspace. Recipients will receive view
        permissions.
      </Typography>
      <List className={list}>{directory.map(directoryObj => renderList(directoryObj))}</List>
      {dashboardsErr !== undefined && (
        <Typography variant={'body2'} className={errMsg}>
          {dashboardsErr['dashboards']}
        </Typography>
      )}
    </Fragment>
  );
};

export default ShareDashboards;
