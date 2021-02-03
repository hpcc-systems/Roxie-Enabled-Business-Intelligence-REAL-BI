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
import { DateRange, ECLEditor, Mapper, Source } from './Tabs';

// Constants
import { filterTypeOptions, sourceOptions } from '../../constants';

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { margin: theme.spacing(2, 0.5, 1, 0.5), maxWidth: '99%' },
  grid: { overflowY: 'hidden' },
}));

const tabOptions = ['ECL Script', 'Source', 'Targets'];

const FilterEditor = props => {
  const { handleChange, localState } = props;
  const { errors = [], filterType, name, sourceType } = localState;
  const [tabIndex, setTabIndex] = useState(0);
  const [tabPercentage, setTabPercentage] = useState('');
  const { appbar, grid } = useStyles();

  const changeSourceType = event => {
    handleChange(null, { name: 'selectedSource', value: {} });
    handleChange(event);
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
      setTabPercentage('33.3%');
    } else if (isDateField) {
      setTabPercentage('100%');
    } else {
      setTabPercentage('50%');
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
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Source Type</InputLabel>
            <Select name='sourceType' value={sourceType} onChange={changeSourceType}>
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
      ) : null}
      <AppBar className={appbar} position='static' color='inherit'>
        <Tabs value={tabIndex} onChange={changeTabIndex}>
          {tabOptions.map((option, index) => {
            /*
              Do not show the 'ECL Script' tab if the source type is not 'ecl'
              Do not show the source tab if the filter type is the date slider
            */
            if (sourceType !== 'ecl' && option === 'ECL Script') {
              return null;
            } else if (isDateField && option === 'Source') {
              return null;
            }

            return (
              <Tab key={index} label={option} style={{ maxWidth: tabPercentage, minWidth: tabPercentage }} />
            );
          })}
        </Tabs>
      </AppBar>
      {(() => {
        // Get correct position based on source type and tab index
        const tabNum = sourceType !== 'ecl' ? (isDateField ? tabIndex + 2 : tabIndex + 1) : tabIndex;

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
            if (filterType !== 'dateRange') {
              return <Mapper {...props} />;
            }

            return <DateRange {...props} />;
          default:
            return 'Unknown Tab';
        }
      })()}
    </Grid>
  );
};

export default FilterEditor;
