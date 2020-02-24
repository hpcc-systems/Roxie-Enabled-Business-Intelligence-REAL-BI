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
  appbar: { margin: `${theme.spacing(3)}px 0 ${theme.spacing(1)}px 0` },
}));

const ChartEditor = props => {
  const { chartType, config, dataObj, dataset, groupBy } = props.localState;
  const [tabIndex, setTabIndex] = useState(0);
  const { appbar } = useStyles();

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Create object of information to pass to chart
  /*
    Clear title for the preview because the offset
    is different than when the chart is on the dashboard
  */
  const chart = { dataset, options: { ...config, groupBy, title: '' }, type: chartType };

  return (
    <Grid container>
      <Grid item xs={6}>
        <QuerySearch {...props} />
        <SelectDataset {...props} />
        <AppBar className={appbar} position="static" color="inherit">
          <Tabs value={tabIndex} onChange={changeTabIndex}>
            {tabOptions.map(({ name, disabled }, index) => {
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
