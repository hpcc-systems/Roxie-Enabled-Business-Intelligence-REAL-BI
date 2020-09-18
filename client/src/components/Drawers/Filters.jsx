import React, { Fragment, useEffect, useState } from 'react';
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
import { updateDashboard } from '../../features/dashboard/actions.js';

// React Components
import Filters from '../Dialog/Filters.jsx';

// React Hooks
import useDialog from '../../hooks/useDialog';

// Utils
import { getSourceData } from '../../utils/source';
import { sortArr } from '../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { margin: 0, minWidth: 30 },
  deleteBtn: { margin: theme.spacing(4, 0, 0, 0), padding: theme.spacing(0, 2, 0, 0) },
  drawer: { width: 'auto', minWidth: 250, maxWidth: 250 },
  drawerClose: { width: 0 },
  drawerPaper: {
    backgroundColor: theme.palette.primary.main,
    marginTop: theme.spacing(8.125),
  },
  drawerPaperClose: { width: 0 },
  editBtn: { margin: theme.spacing(4, 0, 0, 0), padding: 0 },
  fontColor: { color: grey[50] },
  formControl: { color: grey[50], margin: theme.spacing(1) },
  iconColor: { color: grey[50] },
  typography: {
    flexGrow: 1,
    margin: theme.spacing(1.5, 1, 1, 1),
    color: theme.palette.primary.contrastText,
  },
}));

const FilterDrawer = ({ dashboard, showDrawer, toggleDrawer }) => {
  const { filters = [] } = dashboard;
  const [filterIndex, setFilterIndex] = useState(-1);
  const [compData, setCompData] = useState({});
  const { showDialog: showFilter, toggleDialog: toggleFilter } = useDialog(false);
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

  useEffect(() => {
    const { clusterID, filters = [] } = dashboard;

    // Set initial object keys and loading
    filters.forEach(({ sourceID }) => {
      setCompData(prevState => ({ ...prevState, [sourceID]: {} }));
    });

    // Fetch data for each chart
    filters.forEach(({ sourceDataset, sourceID }) => {
      getSourceData(clusterID, sourceDataset, sourceID).then(data => {
        if (typeof data !== 'object') {
          return setCompData(prevState => ({
            ...prevState,
            [sourceID]: { data: [], error: data, loading: false },
          }));
        }

        // Set data in local state object with sourceID as key
        setCompData(prevState => ({ ...prevState, [sourceID]: { data, error: '', loading: false } }));
      });
    });
  }, [dashboard]);

  const setFilterValue = (event, index) => {
    let { value } = event.target;

    // If array of values, join together as string
    if (Array.isArray(value)) {
      value = value.sort().join(',');
    }

    // Create new dashboard object
    const newDashboardObj = { ...dashboard };

    // Alter filter
    newDashboardObj.filters[index] = { ...newDashboardObj.filters[index], value };

    updateDashboard(newDashboardObj).then(action => dispatch(action));
  };

  const newFilter = () => {
    setFilterIndex(-1);
    toggleFilter();
  };

  const setCurrentFilter = index => {
    setFilterIndex(index);
    toggleFilter();
  };

  const deleteFilter = index => {
    // Create new dashboard object
    const dashboardObj = { ...dashboard };

    // Update dashboard object
    dashboardObj.filters.splice(index, 1);

    // Update DB and Redux store
    updateDashboard(dashboardObj).then(action => {
      dispatch(action);
    });
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
          <Button className={button} onClick={newFilter}>
            <AddCircleIcon className={iconColor} />
          </Button>
        </div>
        <Grid container direction='row' justify='space-between'>
          {filters.length > 0 &&
            filters.map(({ name, sourceDataset, sourceField, sourceID, sourceName, value }, index) => {
              if (value) {
                if (value.indexOf(',') > -1) {
                  value = value.split(',').sort();
                } else {
                  value = [value];
                }
              } else {
                value = [];
              }

              return (
                <Fragment key={index}>
                  <Grid item xs={8}>
                    <FormControl className={formControl} fullWidth>
                      <InputLabel className={fontColor}>{name}</InputLabel>
                      <Select
                        multiple
                        value={value}
                        onChange={event => setFilterValue(event, index)}
                        className={fontColor}
                      >
                        {(() => {
                          let data = [];

                          if (compData[sourceID]) {
                            let dataObj = compData[sourceID].data || {};

                            if (Object.keys(dataObj).length > 0) {
                              if (!dataObj.Exception) {
                                data = dataObj[sourceName] || dataObj[sourceDataset] || {};
                                data = data.Row;
                              }
                            }

                            return sortArr(data, sourceField).map((object, index) => {
                              const value = object[sourceField];

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
                    <Button className={editBtn} onClick={() => setCurrentFilter(index)}>
                      <EditIcon className={iconColor} />
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button className={deleteBtn} onClick={() => deleteFilter(index)}>
                      <DeleteIcon className={iconColor} />
                    </Button>
                  </Grid>
                </Fragment>
              );
            })}
        </Grid>
      </div>
      {showFilter && (
        <Filters
          dashboard={dashboard}
          filterIndex={filterIndex}
          show={showFilter}
          toggleDialog={toggleFilter}
        />
      )}
    </Drawer>
  );
};

export default FilterDrawer;
