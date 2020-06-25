import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, FormControl, Grid, InputLabel, MenuItem, Select, Tab, Tabs } from '@material-ui/core';

// React Components
import SourceSearch from './SourceSearch';
import SelectDataset from './SelectDataset';
import { General, GroupBy, Parameters } from './Tabs';
import Chart from '../Chart';

// Constants
import { hasGroupByOption } from '../../utils/misc';
import { sourceOptions } from '../../constants';

const tabOptions = ['General', 'Parameters', 'Group By'];

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { marginBottom: theme.spacing(1) },
  gridContainer: { overflowY: 'hidden' },
}));

const ChartEditor = props => {
  const {
    handleChange,
    localState: { chartID, chartType, dataObj, dataset, options, sourceType },
  } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const { appbar, gridContainer } = useStyles();

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  const changeSourceType = event => {
    handleChange(null, { name: 'selectedSource', value: {} });
    handleChange(event);
  };

  // Create object of information to pass to chart components
  const chart = { dataset, options, type: chartType };

  return (
    <Grid container spacing={4} className={gridContainer}>
      <Grid item xs={6}>
        {/* Only display when not editing an existing chart */}
        {!chartID && (
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
        )}
        <SourceSearch {...props} />
        <SelectDataset {...props} />
        <AppBar className={appbar} position='static' color='inherit'>
          <Tabs value={tabIndex} onChange={changeTabIndex}>
            {tabOptions.map((option, index) => {
              /*
                Do not show the 'group by' tab if the chart selected doesn't support group by
              */
              if (!hasGroupByOption(chartType) && option === 'Group By') {
                return null;
              }

              return <Tab key={index} label={option} />;
            })}
          </Tabs>
        </AppBar>
        {(() => {
          switch (tabIndex) {
            case 0:
              return <General {...props} />;
            case 1:
              return <Parameters {...props} />;
            case 2:
              return <GroupBy {...props} />;
            default:
              return 'Unknown Tab';
          }
        })()}
      </Grid>
      <Grid item xs={6}>
        <Chart chart={chart} dataObj={dataObj} />
      </Grid>
    </Grid>
  );
};

export default ChartEditor;
