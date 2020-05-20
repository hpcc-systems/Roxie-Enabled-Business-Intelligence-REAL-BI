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
  drawer: { width: 250 },
  editBtn: { margin: 0, marginTop: theme.spacing(4), padding: 0 },
  formControl: { margin: theme.spacing(1) },
  typography: { flexGrow: 1, margin: theme.spacing(1), marginTop: theme.spacing(1.5) },
}));

const FilterDrawer = ({ dashboard, deleteFilter, showDrawer, toggleDrawer, queryData }) => {
  const { params = [] } = dashboard;
  const [filterID, setFilterID] = useState(null);
  const { showDialog: showNewDialog, toggleDialog: toggleNewDialog } = useDialog(false);
  const { showDialog: showEditDialog, toggleDialog: toggleEditDialog } = useDialog(false);
  const dispatch = useDispatch();
  const { button, deleteBtn, drawer, editBtn, formControl, typography } = useStyles();
  let datasets = {};

  // Un-nest query datasets for filter dropdowns
  if (Object.keys(queryData).length > 0) {
    Object.keys(queryData)
      .map(key => queryData[key].data)
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
    <Drawer open={showDrawer} onClose={toggleDrawer} anchor='right'>
      <div className={drawer} role='presentation'>
        <div style={{ display: 'flex' }}>
          <Typography variant='h6' align='left' color='inherit' className={typography}>
            Dashboard Filters
          </Typography>
          <Button className={button} onClick={toggleNewDialog}>
            <AddCircleIcon />
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
                      <InputLabel>{name}</InputLabel>
                      <Select multiple value={value || []} onChange={event => setParam(event, id)}>
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
                      <EditIcon />
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button className={deleteBtn} onClick={() => deleteFilter(id)}>
                      <DeleteIcon />
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
