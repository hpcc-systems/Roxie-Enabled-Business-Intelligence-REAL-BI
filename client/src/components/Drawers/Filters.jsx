import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';

// Redux Actions
import { updateDashboardParam } from '../../features/dashboard/actions';

// Create styles
const useStyles = makeStyles(theme => ({
  div: { margin: theme.spacing(1), marginTop: 0 },
  drawer: { width: 'auto', minWidth: 250 },
  formControl: { margin: `${theme.spacing(1)}px 0` },
  typography: { margin: theme.spacing(1), marginBottom: 0 },
}));

const FilterDrawer = ({ dashboard, showDrawer, toggleDrawer, queryData }) => {
  const { id: dashboardID, params = [] } = dashboard;
  const dispatch = useDispatch();
  const { div, drawer, formControl, typography } = useStyles();
  let datasets = {};

  // Un-nest query datasets for filter dropdowns
  if (Object.keys(queryData).length > 0) {
    Object.keys(queryData)
      .map(key => queryData[key].data)
      .forEach(nestedObj => (datasets = { ...datasets, ...nestedObj }));
  }

  const setParam = (event, paramID) => {
    const { value } = event.target;

    updateDashboardParam(dashboardID, paramID, value).then(action => dispatch(action));
  };

  return (
    <Drawer open={showDrawer} onClose={toggleDrawer} anchor="right">
      <div className={drawer} role="presentation">
        <Typography variant="h6" align="center" color="inherit" className={typography}>
          Dashboard Filters
        </Typography>
      </div>
      <div className={div}>
        {params.length > 0 &&
          params.map(({ dataset, id, name, value }, index) => {
            return (
              <FormControl key={index} className={formControl} fullWidth>
                <InputLabel>{name}</InputLabel>
                <Select value={value || ''} onChange={event => setParam(event, id)}>
                  {datasets[dataset] && <MenuItem value={''}>Clear Selection</MenuItem>}
                  {(() => {
                    if (datasets[dataset]) {
                      // Get the first key from the first object from reference dataset
                      const key = Object.keys(datasets[dataset].Row[0])[0];

                      return datasets[dataset].Row.map((object, index) => {
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
    </Drawer>
  );
};

export default FilterDrawer;
