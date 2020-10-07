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
import { ECLEditor, Mapper, Source } from './Tabs';

// Constants
import { sourceOptions } from '../../constants';

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { margin: theme.spacing(2, 0.5, 1, 0.5), maxWidth: '99%' },
  grid: { overflowY: 'hidden' },
}));

const tabOptions = ['ECL Script', 'Source', 'Targets'];

const FilterEditor = props => {
  const { dashboard, eclRef, handleChange, localState } = props;
  const { clusterHost, clusterPort } = dashboard;
  const { name, sourceType } = localState;
  const [tabIndex, setTabIndex] = useState(0);
  const [tabPercentage, setTabPercentage] = useState('');
  const { appbar, grid } = useStyles();

  const changeSourceType = event => {
    handleChange(null, { name: 'selectedSource', value: {} });
    handleChange(event);
  };

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    // Get percentage of tab width
    if (sourceType === 'ecl') {
      setTabPercentage('33%');
    } else {
      setTabPercentage('50%');
    }
  }, [sourceType]);

  const clusterURL = `${clusterHost}:${clusterPort}`;

  return (
    <Grid container direction='row' spacing={1} className={grid}>
      <Grid item xs={12}>
        <TextField fullWidth label='Filter Name' name='name' value={name} onChange={handleChange} />
      </Grid>
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
      <AppBar className={appbar} position='static' color='inherit'>
        <Tabs value={tabIndex} onChange={changeTabIndex}>
          {tabOptions.map((option, index) => {
            /*
              Do not show the 'ECL Script' tab if the source type is not 'ecl'
            */
            if (sourceType !== 'ecl' && option === 'ECL Script') {
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
        // If sourceType === 'ecl', skip parameters tab
        const tabNum = sourceType !== 'ecl' ? tabIndex + 1 : tabIndex;

        switch (tabNum) {
          case 0:
            return (
              <Grid item xs={12}>
                <ECLEditor {...props} clusterURL={clusterURL} eclRef={eclRef} />
              </Grid>
            );
          case 1:
            return <Source {...props} />;
          case 2:
            return <Mapper {...props} />;
          default:
            return 'Unknown Tab';
        }
      })()}
    </Grid>
  );
};

export default FilterEditor;
