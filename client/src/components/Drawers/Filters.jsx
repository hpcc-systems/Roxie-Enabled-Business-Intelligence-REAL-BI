/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  CircularProgress,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { AddCircle as AddCircleIcon, Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import clsx from 'clsx';

// Redux Actions
import {
  deleteExistingFilter,
  refreshDataByChartIds,
  updateFilterValue,
} from '../../features/dashboard/actions.js';

// React Components
import Filters from '../Dialog/Filters.jsx';
import DateRange from '../DateRange';
import DateField from '../DateField';

// React Hooks
import useDialog from '../../hooks/useDialog';

// Utils
import { getFilterValue, getFilterValueType } from '../../utils/dashboardFilter.js';
import { getSourceData } from '../../features/dashboardFilters/actions.js';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { margin: 0, minWidth: 30 },
  deleteBtn: { margin: theme.spacing(4, 2, 0, 1), padding: theme.spacing(0, 2, 0, 0) },
  drawer: {
    color: theme.palette.primary.contrastText,
    width: 'auto',
    minWidth: 200,
    maxWidth: 300,
    padding: theme.spacing(1),
  },
  drawerClose: { width: 0 },
  drawerPaper: {
    backgroundColor: theme.palette.primary.main,
    marginTop: theme.spacing(8.125),
  },
  drawerPaperClose: { width: 0 },
  editBtn: { margin: theme.spacing(4, 0, 0, 1), padding: 0 },
  formControl: { color: `${theme.palette.primary.contrastText} !important` },
  iconColor: { color: theme.palette.primary.contrastText },
  progress: { margin: theme.spacing(1, 0, 1, 1) },
  rangeBtn: { marginTop: theme.spacing(8) },
  typography: {
    flexGrow: 1,
    margin: theme.spacing(1.5, 1, 1, 1),
    color: theme.palette.primary.contrastText,
  },
}));

const FilterDrawer = ({ showDrawer, toggleDrawer }) => {
  const [dashboard, dashboardFilters] = useSelector(state => [
    state.dashboard.dashboard,
    state.dashboardFilters,
  ]);
  const { filters = [], id: dashboardID, permission, accessOnBehalf } = dashboard;
  const [filter, setFilter] = useState(null);
  const [showFilter, toggleFilter] = useDialog(false);
  const dispatch = useDispatch();
  const {
    button,
    deleteBtn,
    drawer,
    drawerClose,
    drawerPaper,
    drawerPaperClose,
    editBtn,
    formControl,
    iconColor,
    rangeBtn,
    typography,
  } = useStyles();

  const getFiltersData = filters => {
    const uniqueSources = filters.reduce(
      (acc, filter) => {
        const hpccID = filter?.source?.hpccID;
        if (hpccID) {
          if (!acc.hpccIds.includes(hpccID)) {
            acc.hpccIds.push(hpccID);
            acc.sources.push({ hpccID, filterID: filter.id, clusterID: filter.cluster.id, accessOnBehalf });
          }
        }
        return acc;
      },
      { hpccIds: [], sources: [] },
    );

    uniqueSources.sources.forEach(source => {
      if (!dashboardFilters[source.hpccID] || dashboardFilters[source.hpccID]?.error) {
        dispatch(getSourceData(source));
      }
    });
  };

  useEffect(() => {
    getFiltersData(filters);
  }, [showFilter]);

  const newFilter = () => {
    setFilter(null);
    toggleFilter();
  };

  const setCurrentFilter = filterID => {
    const filter = filters.find(({ id }) => id === filterID);
    setFilter(filter);
    toggleFilter();
  };

  const setFilterValue = async (event, valueObj, filterID) => {
    let { value } = event.target;

    if (Array.isArray(value)) {
      value = value.join(',');
    }

    // Get altered filter to make dataCall
    const selectedFilter = filters.find(({ id }) => id === filterID);
    selectedFilter.value.value = value;

    // Get unique id's of the targeted charts
    const effectedChartIds = [
      ...new Set(selectedFilter.configuration.params.map(({ targetChart }) => targetChart)),
    ];

    try {
      const dataType = getFilterValueType(value);
      const action = await updateFilterValue({ ...valueObj, dataType, value }, dashboardID);
      dispatch(action);
      dispatch(refreshDataByChartIds(effectedChartIds));
    } catch (error) {
      dispatch(error);
    }
  };

  const deleteFilter = async id => {
    const filterObj = filters.find(({ id: filterID }) => filterID === id);

    // Get unique id's of the targeted charts
    const effectedChartIds = [
      ...new Set(filterObj.configuration.params.map(({ targetChart }) => targetChart)),
    ];

    try {
      const action = await deleteExistingFilter(dashboardID, id);
      dispatch(action);
      dispatch(refreshDataByChartIds(effectedChartIds));
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
        <Grid container direction='row' justifyContent='space-between' alignItems='center'>
          {filters.map(({ configuration, id, value, source }) => {
            const filterSource = dashboardFilters[source?.hpccID]; // finding data for source that is stored in redux

            if (!filterSource) return null;

            let filterVal = getFilterValue(value, configuration.type);

            const getUniqueColumn = (data, configFiledName) => {
              if (!Array.isArray(data)) return [];
              return [...new Set(data.map(row => String(row[configFiledName])))];
            };

            if (configuration.type === 'valuesDropdown') {
              filterVal = Array.isArray(filterVal) ? filterVal.map(val => String(val)) : [String(filterVal)];
            }
            return (
              <Fragment key={id}>
                <Grid item xs={8}>
                  {configuration.type === 'dateRange' ? (
                    <DateRange
                      filterID={id}
                      name={configuration.name}
                      valueObj={value}
                      values={filterVal}
                      onChange={setFilterValue}
                    />
                  ) : configuration.type === 'dateField' ? (
                    <DateField
                      filterID={id}
                      name={configuration.name}
                      valueObj={value}
                      value={filterVal}
                      onChange={setFilterValue}
                    />
                  ) : (
                    <>
                      {filterSource.loading ? (
                        '...loading'
                      ) : (
                        <FormControl className={formControl} fullWidth error={filterSource.error}>
                          <InputLabel className={formControl}>{configuration.name}</InputLabel>
                          <Select
                            multiple
                            value={filterVal || ''}
                            className={formControl}
                            onChange={event => setFilterValue(event, value, id)}
                          >
                            {getUniqueColumn(filterSource.data, configuration.field)?.map((name, index) => {
                              return (
                                <MenuItem key={index} value={name}>
                                  {name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          {filterSource.error && <FormHelperText>{filterSource.error}</FormHelperText>}
                        </FormControl>
                      )}
                    </>
                  )}
                </Grid>
                {permission === 'Owner' ? (
                  <>
                    <Grid item xs={2}>
                      <Button
                        className={clsx(button, editBtn, {
                          [rangeBtn]: configuration.type === 'dateRange',
                        })}
                        onClick={() => setCurrentFilter(id)}
                      >
                        <EditIcon className={iconColor} />
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        className={clsx(button, deleteBtn, {
                          [rangeBtn]: configuration.type === 'dateRange',
                        })}
                        onClick={() => deleteFilter(id)}
                      >
                        <DeleteIcon className={iconColor} />
                      </Button>
                    </Grid>
                  </>
                ) : null}
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
