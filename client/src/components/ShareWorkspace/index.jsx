import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Grid, Tab, Tabs } from '@material-ui/core';

// React Components
import { Dashboards, ShareRecipients } from './Tabs';

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { marginBottom: theme.spacing(1) },
  grid: { marginBottom: theme.spacing(2), overflowY: 'hidden' },
}));

const tabOptions = ['Recipients', 'Dashboards'];

const ShareWorkspace = props => {
  const [tabIndex, setTabIndex] = useState(0);
  const { appbar, grid } = useStyles();

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Grid container direction='row' spacing={1} className={grid}>
      <AppBar className={appbar} position='static' color='inherit'>
        <Tabs value={tabIndex} onChange={changeTabIndex}>
          {tabOptions.map((option, index) => {
            return <Tab key={index} label={option} style={{ maxWidth: '50%', minWidth: '50%' }} />;
          })}
        </Tabs>
      </AppBar>
      {(() => {
        switch (tabIndex) {
          case 0:
            return <ShareRecipients {...props} />;
          case 1:
            return <Dashboards {...props} />;
          default:
            return 'Unknown Tab';
        }
      })()}
    </Grid>
  );
};

export default ShareWorkspace;
