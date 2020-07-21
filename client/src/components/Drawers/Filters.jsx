import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { AddCircle as AddCircleIcon, Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';

// Redux Actions
import { updateDashboardParam } from '../../features/dashboard/actions';

// React Components
import NewFilter from '../Dialog/newFilter';
import EditFilter from '../Dialog/editFilter';

// React Hooks
import useDialog from '../../hooks/useDialog';

// Utils
import { sortArr } from '../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { margin: 0, minWidth: 30 },
  deleteBtn: { margin: 0, marginTop: theme.spacing(4), padding: 0, paddingRight: theme.spacing(2) },
  drawer: { width: 'auto', minWidth: 250 },
  drawerClose: { width: 0 },
  drawerPaper: {
    backgroundColor: theme.palette.primary.main,
    marginTop: theme.spacing(6.75),
  },
  drawerPaperClose: { width: 0 },
  editBtn: { margin: 0, marginTop: theme.spacing(4), padding: 0 },
  fontColor: { color: grey[50] },
  formControl: { color: grey[50], margin: theme.spacing(1) },
  iconColor: { color: grey[50] },
  typography: {
    flexGrow: 1,
    margin: theme.spacing(1),
    marginTop: theme.spacing(1.5),
    color: theme.palette.primary.contrastText,
  },
}));

const FilterDrawer = ({ compData, dashboard, deleteFilter, showDrawer, toggleDrawer }) => {
  const { params = [] } = dashboard;
  const [filterID, setFilterID] = useState(null);
  const { showDialog: showNewDialog, toggleDialog: toggleNewDialog } = useDialog(false);
  const { showDialog: showEditDialog, toggleDialog: toggleEditDialog } = useDialog(false);
  const dispatch = useDispatch();
  const {
    button,
    deleteBtn,
    drawer,
    drawerClose,
    drawerPaper,
    drawerPaperClose,
    editBtn,
    fontColor,
    formControl,
    iconColor,
    typography,
  } = useStyles();
  let datasets = {};

  // Un-nest source datasets for filter dropdowns
  if (Object.keys(compData).length > 0) {
    Object.keys(compData)
      .map(key => compData[key].data)
      .forEach(nestedObj => (datasets = { ...datasets, ...nestedObj }));
  }

  const setParam = (event, paramID) => {
    let { value } = event.target;

    // If array of values, join together as string
    if (Array.isArray(value)) {
      value = value.sort().join(',');
    }

    // Get altered param
    const param = params.find(({ id }) => id === paramID);

    updateDashboardParam({ ...param, value }).then(action => dispatch(action));
  };

  const editFilter = id => {
    setFilterID(id);
    toggleEditDialog();
  };

  return (
    <Drawer
      open={showDrawer}
      onClose={toggleDrawer}
      classes={{ paper: showDrawer ? drawerPaper : drawerPaperClose }}
      variant='temporary'
      anchor='right'
    >
      <div className={showDrawer ? drawer : drawerClose}>
        <div style={{ display: 'flex' }}>
          <Typography variant='h6' align='left' color='inherit' className={typography}>
            Dashboard Filters
          </Typography>
          <Button className={button} onClick={toggleNewDialog}>
            <AddCircleIcon className={iconColor} />
          </Button>
        </div>
        <Grid container direction='row' justify='space-between'>
          {params.length > 0 &&
            params.map(({ dataset, id, name, value }, index) => {
              if (value) {
                if (value.indexOf(',') > -1) {
                  value = value.split(',').sort();
                } else {
                  value = [value];
                }
              }

              return (
                <Fragment key={index}>
                  <Grid item xs={8}>
                    <FormControl className={formControl} fullWidth>
                      <InputLabel className={fontColor}>{name}</InputLabel>
                      <Select
                        multiple
                        value={value || []}
                        onChange={event => setParam(event, id)}
                        className={fontColor}
                      >
                        {(() => {
                          if (datasets[dataset]) {
                            // Get the first key from the first object from reference dataset
                            const key = Object.keys(datasets[dataset].Row[0])[0];

                            return sortArr(datasets[dataset].Row, key).map((object, index) => {
                              const value = object[key];

                              return (
                                <MenuItem key={index} value={value}>
                                  {value}
                                </MenuItem>
                              );
                            });
                          }
                        })()}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <Button className={editBtn} onClick={() => editFilter(id)}>
                      <EditIcon className={iconColor} />
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button className={deleteBtn} onClick={() => deleteFilter(id)}>
                      <DeleteIcon className={iconColor} />
                    </Button>
                  </Grid>
                </Fragment>
              );
            })}
        </Grid>
      </div>
      {showNewDialog && <NewFilter show={showNewDialog} toggleDialog={toggleNewDialog} />}
      {showEditDialog && (
        <EditFilter filterID={filterID} show={showEditDialog} toggleDialog={toggleEditDialog} />
      )}
    </Drawer>
  );
};

export default FilterDrawer;
