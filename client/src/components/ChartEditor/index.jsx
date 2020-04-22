import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Grid, Tab, Tabs } from '@material-ui/core';

// React Components
import QuerySearch from './QuerySearch';
import SelectDataset from './SelectDataset';
import { General, GroupBy, Parameters } from './Tabs';
import Chart from '../Chart';

const tabOptions = [
  { name: 'General', disabled: false },
  { name: 'Parameters', disabled: false },
  { name: 'Group By', disabled: false },
];

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { marginBottom: theme.spacing(1) },
  gridContainer: { overflowY: 'hidden' },
}));

const ChartEditor = props => {
  const { chartType, dataObj, dataset, options } = props.localState;
  const [tabIndex, setTabIndex] = useState(0);
  const { appbar, gridContainer } = useStyles();

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Create object of information to pass to chart components
  const chart = { dataset, options, type: chartType };

  return (
    <Grid container spacing={4} className={gridContainer}>
      <Grid item xs={6}>
        <QuerySearch {...props} />
        <SelectDataset {...props} />
        <AppBar className={appbar} position='static' color='inherit'>
          <Tabs value={tabIndex} onChange={changeTabIndex}>
            {tabOptions.map(({ name, disabled }, index) => {
              // Do not show the 'group by' tab if the chart selected is a pie chart
              if (chartType === 'pie' && name === 'Group By') {
                return null;
              }

              return <Tab key={index} label={name} disabled={disabled} />;
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
