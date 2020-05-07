import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Drawer, FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { AddCircle as AddCircleIcon } from '@material-ui/icons';

// Redux Actions
import { updateDashboardParam } from '../../features/dashboard/actions';

// React Components
import NewFilter from '../Dialog/newFilter';

// React Hooks
import useDialog from '../../hooks/useDialog';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    margin: 0,
    marginRight: theme.spacing(2),
    minWidth: 30,
    padding: 0,
  },
  div: { margin: theme.spacing(1), marginTop: 0 },
  drawer: { display: 'flex', minWidth: 250 },
  formControl: { margin: `${theme.spacing(1)}px 0` },
  typography: { flexGrow: 1, margin: theme.spacing(1), marginTop: theme.spacing(1.5) },
}));

const sortArray = (arr, key) => {
  arr.sort((a, b) => {
    let aField = a[key];
    let bField = b[key];

    // Format value
    aField = isNaN(Number(aField)) ? aField.trim().toLowerCase() : Number(aField);
    bField = isNaN(Number(bField)) ? bField.trim().toLowerCase() : Number(bField);

    if (aField < bField) {
      return -1;
    } else if (aField > bField) {
      return 1;
    }

    return 0;
  });

  return arr;
};

const FilterDrawer = ({ dashboard, showDrawer, toggleDrawer, queryData }) => {
  const { params = [] } = dashboard;
  const { showDialog, toggleDialog } = useDialog(false);
  const dispatch = useDispatch();
  const { button, div, drawer, formControl, typography } = useStyles();
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
    const param = params.filter(({ id }) => id === paramID)[0];

    updateDashboardParam({ ...param, value }).then(action => dispatch(action));
  };

  return (
    <Drawer open={showDrawer} onClose={toggleDrawer} anchor='right'>
      <div className={drawer} role='presentation'>
        <Typography variant='h6' align='left' color='inherit' className={typography}>
          Dashboard Filters
        </Typography>
        <Button className={button} onClick={toggleDialog}>
          <AddCircleIcon />
        </Button>
      </div>
      <div className={div}>
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
              <FormControl key={index} className={formControl} fullWidth>
                <InputLabel>{name}</InputLabel>
                <Select multiple value={value || []} onChange={event => setParam(event, id)}>
                  {(() => {
                    if (datasets[dataset]) {
                      // Get the first key from the first object from reference dataset
                      const key = Object.keys(datasets[dataset].Row[0])[0];

                      return sortArray(datasets[dataset].Row, key).map((object, index) => {
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
            );
          })}
      </div>
      {showDialog && <NewFilter show={showDialog} toggleDialog={toggleDialog} />}
    </Drawer>
  );
};

export default FilterDrawer;
