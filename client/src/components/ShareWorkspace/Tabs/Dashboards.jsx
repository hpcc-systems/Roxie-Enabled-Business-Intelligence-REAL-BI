import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Utils
import { getDashboardsFromDirectory } from '../../../utils/directory';

const useStyles = makeStyles(theme => ({
  dialogText: { fontSize: '0.85rem', marginTop: theme.spacing(1.5) },
  errMsg: { color: theme.palette.error.dark },
  item: { paddingLeft: 0 },
  itemText: { fontSize: '1.07rem' },
  list: { maxHeight: '25vh', overflowY: 'auto', width: '100%' },
}));

const ShareDashboards = ({ handleChange, localState }) => {
  const { directory } = useSelector(state => state.workspace.workspace);
  const { dashboards: selectedDashboards } = localState;
  const dashboards = getDashboardsFromDirectory(directory, []);
  const { dialogText, errMsg, item, itemText, list } = useStyles();

  const handleToggle = value => () => {
    const currentIndex = selectedDashboards.indexOf(value);
    const newSelectedDashboards = [...selectedDashboards];

    if (currentIndex === -1) {
      newSelectedDashboards.push(value);
    } else {
      newSelectedDashboards.splice(currentIndex, 1);
    }

    handleChange(null, { name: 'dashboards', value: newSelectedDashboards });
  };

  const { errors } = localState;
  const dashboardsErr = errors.find(err => err['dashboards']);

  return (
    <Fragment>
      <Typography className={dialogText}>
        Choose which dashboards you wish to share from this workspace. Recipients will receive view
        permissions.
      </Typography>
      <List className={list}>
        {dashboards.map((dashboard, index) => {
          const { id, name } = dashboard;
          const labelId = `checkbox-list-label-${id}`;

          return (
            <ListItem key={index} role={undefined} dense button onClick={handleToggle(id)} className={item}>
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={selectedDashboards.indexOf(id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText primary={name} classes={{ primary: itemText }} />
            </ListItem>
          );
        })}
      </List>
      {dashboardsErr !== undefined && (
        <Typography variant={'body2'} className={errMsg}>
          {dashboardsErr['dashboards']}
        </Typography>
      )}
    </Fragment>
  );
};

export default ShareDashboards;
