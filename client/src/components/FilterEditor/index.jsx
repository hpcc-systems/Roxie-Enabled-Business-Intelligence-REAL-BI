import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from '@material-ui/core';

// React Components
import { DateRange, ECLEditor, Mapper, Parameters, Source } from './Tabs';

// Constants
import { filterTypeOptions, sourceOptions } from '../../constants';

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { margin: theme.spacing(2, 0.5, 1, 0.5), maxWidth: '99%' },
  grid: { overflowY: 'hidden' },
}));

const tabOptions = ['ECL Script', 'Source', 'Parameters', 'Targets'];

const FilterEditor = props => {
  const { handleChange, localState, dashboard } = props;
  const { errors = [], filterType, name, sourceType, targetCluster } = localState;
  const [tabIndex, setTabIndex] = useState(0);
  const [tabPercentage, setTabPercentage] = useState('');
  const { appbar, grid } = useStyles();
  const { targetClusters } = dashboard;

  const changeSourceType = event => {
    handleChange(null, { name: 'selectedSource', value: {} });
    handleChange(event);
  };

  const changeTargetCluster = event => {
    handleChange(null, { name: 'targetCluster', value: event.target.value });
  };

  const resetTabIndex = event => {
    setTabIndex(0);
    handleChange(event);
  };

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  const isDateField = filterType === 'dateField' || filterType === 'dateRange';

  useEffect(() => {
    // Get percentage of tab width
    if (sourceType === 'ecl') {
      setTabPercentage('25%');
    } else if (isDateField) {
      setTabPercentage('100%');
    } else {
      setTabPercentage('33.3%');
    }
  }, [filterType, sourceType]);

  const nameErr = errors.find(err => err['name']);

  return (
    <Grid container direction='row' spacing={1} className={grid}>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Filter Type</InputLabel>
          <Select name='filterType' value={filterType} onChange={resetTabIndex}>
            {filterTypeOptions.map(({ label, value }, index) => {
              return (
                <MenuItem key={index} value={value}>
                  {label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label='Filter Name'
          name='name'
          value={name}
          onChange={handleChange}
          error={nameErr !== undefined}
          helperText={nameErr !== undefined ? nameErr['name'] : ''}
        />
      </Grid>
      {!isDateField ? (
        <>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Source Type</InputLabel>
              <Select
                name='sourceType'
                value={sourceType}
                onChange={changeSourceType}
                disabled={!localState.isFilterReady}
              >
                {sourceOptions.map((option, index) => {
                  return (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          {sourceType === 'query' ? (
            <FormControl fullWidth>
              <InputLabel>Select Target Cluster</InputLabel>
              <Select name='targetCluster' value={targetCluster} onChange={changeTargetCluster}>
                {targetClusters.map((cluster, index) => {
                  return (
                    <MenuItem key={index} value={cluster.Name}>
                      {cluster.Name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          ) : null}
        </>
      ) : null}

      <AppBar className={appbar} position='static' color='inherit'>
        <Tabs value={tabIndex} onChange={changeTabIndex} disabled={!localState.isFilterReady}>
          {tabOptions.map((option, index) => {
            /*
              Do not show the 'ECL Script' tab if the source type is not 'ecl'
              Do not show the source tab if the filter type is the date slider
            */
            if (sourceType !== 'ecl' && option === 'ECL Script') {
              return null;
            } else if (isDateField && (option === 'Source' || option === 'Parameters')) {
              return null;
            }

            return (
              <Tab key={index} label={option} style={{ maxWidth: tabPercentage, minWidth: tabPercentage }} />
            );
          })}
        </Tabs>
      </AppBar>

      <>
        {(() => {
          // Get correct position based on source type and tab index
          const tabNum = sourceType !== 'ecl' ? (isDateField ? tabIndex + 3 : tabIndex + 1) : tabIndex;

          switch (tabNum) {
            case 0:
              return (
                <Grid item xs={12}>
                  <ECLEditor {...props} />
                </Grid>
              );
            case 1:
              return <Source {...props} />;
            case 2:
              return <Parameters {...props} />;
            case 3:
              if (filterType !== 'dateRange') {
                return <Mapper {...props} />;
              }

              return <DateRange {...props} />;
            default:
              return 'Unknown Tab';
          }
        })()}
      </>
    </Grid>
  );
};

export default FilterEditor;
