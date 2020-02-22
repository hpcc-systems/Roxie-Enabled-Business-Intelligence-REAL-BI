import React, { useState } from 'react';
import { AppBar, Grid, Tab, Tabs } from '@material-ui/core';

// React Components
import QuerySearch from './QuerySearch';
import SelectDataset from './SelectDataset';
import { General, Parameters } from './Tabs';

const tabOptions = [
  { name: 'General', disabled: false },
  { name: 'Parameters', disabled: false },
  { name: 'X Axis', disabled: true },
  { name: 'Y Axis', disabled: true },
];

const ChartEditor = props => {
  const [tabIndex, setTabIndex] = useState(0);

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        <QuerySearch {...props} />
        <SelectDataset {...props} />
        <AppBar position="static" color="inherit">
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
            default:
              return 'Unknown Tab';
          }
        })()}
      </Grid>
      <Grid item xs={6}>
        <p>Column 2</p>
      </Grid>
    </Grid>
  );
};

export default ChartEditor;
