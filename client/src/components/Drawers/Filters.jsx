import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  CircularProgress,
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
import clsx from 'clsx';
import _ from 'lodash';

// Redux Actions
import { deleteExistingFilter, updateFilterValue } from '../../features/dashboard/actions.js';

// React Components
import Filters from '../Dialog/Filters.jsx';
import DateRange from '../DateRange';
import DateField from '../DateField';

// React Hooks
import useDialog from '../../hooks/useDialog';

// Utils
import { getFilterData, getFilterValue, getFilterValueType } from '../../utils/dashboardFilter.js';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { margin: 0, minWidth: 30 },
  deleteBtn: { margin: theme.spacing(4, 2, 0, 1), padding: theme.spacing(0, 2, 0, 0) },
  drawer: {},
  drawerClose: { width: 0 },
  drawerPaper: {
    backgroundColor: theme.palette.primary.main,
    marginTop: theme.spacing(8.125),
  },
  drawerPaperClose: { width: 0 },
  editBtn: { margin: theme.spacing(4, 0, 0, 1), padding: 0 },
  fontColor: { color: grey[50] },
  formControl: { color: grey[50], margin: theme.spacing(1) },
  iconColor: { color: grey[50] },
  progress: { margin: theme.spacing(1, 0, 1, 1) },
  sliderBtn: { marginTop: theme.spacing(9) },
  typography: {
    flexGrow: 1,
    margin: theme.spacing(1.5, 1, 1, 1),
    color: theme.palette.primary.contrastText,
  },
}));

const FilterDrawer = ({ dashboard, showDrawer, toggleDrawer }) => {
  const { filters = [], id: dashboardID, permission } = dashboard;
  const [filter, setFilter] = useState(null);
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
    progress,
    sliderBtn,
    typography,
  } = useStyles();

  const dataCall = useCallback(() => {
    // Set initial object keys and loading
    filters.forEach(({ id: filterID }) => {
      setCompData(prevState => ({ ...prevState, [filterID]: { loading: true } }));
    });

    // Fetch data for each filter
    filters.forEach(({ cluster, id: filterID }) => {
      (async () => {
        try {
          const results = await getFilterData(cluster.id, filterID);
          setCompData(prevState => ({
            ...prevState,
            [filterID]: { data: results.data, error: '', loading: false },
          }));
        } catch (error) {
          setCompData(prevState => ({ ...prevState, [filterID]: { error: error.message, loading: false } }));
        }
      })();
    });
  }, [filters]);

  useEffect(() => {
    if (filters.length > 0) {
      dataCall();
    }
  }, [dataCall, filters]);

  const newFilter = () => {
    setFilter(null);
    toggleFilter();
  };

  const setCurrentFilter = filterID => {
    const filter = filters.find(({ id }) => id === filterID);
    setFilter(filter);
    toggleFilter();
  };

  const setFilterValue = async (event, valueObj) => {
    let { value } = event.target;

    if (Array.isArray(value)) {
      value = value.join();
    }

    try {
      const dataType = getFilterValueType(value);
      const action = await updateFilterValue({ ...valueObj, dataType, value }, dashboardID);
      dispatch(action);
    } catch (error) {
      dispatch(error);
    }
  };

  const deleteFilter = async id => {
    try {
      const action = await deleteExistingFilter(dashboardID, id);
      dispatch(action);
    } catch (error) {
      dispatch(error);
    }
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
          {permission !== 'Read-Only' && (
            <Button className={button} onClick={newFilter}>
              <AddCircleIcon className={iconColor} />
            </Button>
          )}
        </div>
        <Grid container direction='row' justify='space-between'>
          {filters.map(({ configuration, id, name, value }) => {
            const dataObj = compData[id] || {};
            const { data = [], loading = false } = dataObj;
            const filterVal = getFilterValue(value, configuration.type);

            return loading ? (
              <Grid item key={id} xs={12} className={progress}>
                <CircularProgress color='secondary' size={30} />
              </Grid>
            ) : (
              <Fragment key={id}>
                <Grid item xs={8}>
                  {configuration.type === 'dateRange' ? (
                    <DateRange
                      minDate={configuration.minDate}
                      maxDate={configuration.maxDate || new Date()}
                      name={configuration.name}
                      valueObj={value}
                      values={filterVal}
                      onChange={setFilterValue}
                    />
                  ) : configuration.type === 'dateField' ? (
                    <DateField
                      name={configuration.name}
                      valueObj={value}
                      value={filterVal}
                      onChange={setFilterValue}
                    />
                  ) : (
                    <FormControl className={formControl} fullWidth>
                      <InputLabel className={fontColor}>{name}</InputLabel>
                      <Select
                        multiple
                        value={filterVal}
                        onChange={event => setFilterValue(event, value)}
                        className={fontColor}
                      >
                        {(() => {
                          return _.orderBy(
                            data,
                            [({ configuration }) => configuration?.field || ''],
                            ['asc'],
                          ).map((object, index) => {
                            const value = object[configuration.field];
                            return (
                              <MenuItem key={index} value={value}>
                                {value}
                              </MenuItem>
                            );
                          });
                        })()}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <Button
                    className={clsx(button, editBtn, { [sliderBtn]: configuration.type === 'dateRange' })}
                    onClick={() => setCurrentFilter(id)}
                  >
                    <EditIcon className={iconColor} />
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    className={clsx(button, deleteBtn, { [sliderBtn]: configuration.type === 'dateRange' })}
                    onClick={() => deleteFilter(id)}
                  >
                    <DeleteIcon className={iconColor} />
                  </Button>
                </Grid>
              </Fragment>
            );
          })}
        </Grid>
      </div>
      {showFilter && (
        <Filters dashboard={dashboard} filter={filter} show={showFilter} toggleDialog={toggleFilter} />
      )}
    </Drawer>
  );
};

export default FilterDrawer;
