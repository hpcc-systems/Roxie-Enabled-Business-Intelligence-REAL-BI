import React, { Fragment, useState } from 'react';
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
  Typography,
} from '@material-ui/core';

// React Components
import SourceSearch from './SourceSearch';
import SelectDataset from './SelectDataset';
import { ECLEditor, General, GroupBy, Parameters } from './Tabs';
import Chart from '../Chart';

// Constants
import { hasGroupByOption } from '../../utils/misc';
import { sourceOptions } from '../../constants';

const tabOptions = ['ECL Script', 'General', 'Parameters', 'Group By'];

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { marginBottom: theme.spacing(1) },
  formControl: { marginBottom: theme.spacing(3) },
  gridContainer: { overflowY: 'hidden' },
  tab: { minWidth: 140 },
  typography: {
    ...theme.typography.button,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const ChartEditor = props => {
  const { dashboard, eclRef, handleChange, localState } = props;
  const { clusterHost, clusterID, clusterPort } = dashboard;
  const { chartID, config, dataObj, dataset, error, sourceType } = localState;
  const { data: eclData = {}, dataset: eclDataset } = eclRef.current;
  let { isStatic, type } = config;
  isStatic = type !== 'textBox' || isStatic === 'undefined' ? false : isStatic;

  const [tabIndex, setTabIndex] = useState(0);
  const { appbar, formControl, gridContainer, tab, typography } = useStyles();

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  const changeSourceType = event => {
    handleChange(null, { name: 'selectedSource', value: {} });
    handleChange(event);
  };

  const updateAxisKey = event => {
    const { name, value } = event.target;
    const [state, key] = name.split(':');
    let newConfig = localState.config;

    // Update object key
    newConfig = { ...newConfig, [state]: { ...newConfig[state], [key]: value } };

    return handleChange(null, { name: 'config', value: newConfig });
  };

  // Create object of information to pass to chart components
  const newConfig = { ...config, dataset };
  const clusterURL = `${clusterHost}:${clusterPort}`;
  let chartData = dataObj;

  // If ECL Ref has data, use that array
  if (sourceType === 'ecl' && Object.keys(eclData).length > 0) {
    chartData = { data: eclData, error: '', loading: false };
  }

  return (
    <Grid container spacing={4} className={gridContainer}>
      <Grid item xs={6}>
        {error !== '' && (
          <Typography className={typography} align='center'>
            {error}
          </Typography>
        )}
        {/* Only display when not editing an existing chart */}
        {!chartID && (type !== 'textBox' || (type === 'textBox' && !isStatic)) && (
          <FormControl fullWidth className={sourceType === 'ecl' ? formControl : null}>
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
        {sourceType !== 'ecl' && (
          <Fragment>
            <SourceSearch {...props} />
            <SelectDataset {...props} />
          </Fragment>
        )}
        <AppBar className={appbar} position='static' color='inherit'>
          <Tabs value={tabIndex} onChange={changeTabIndex}>
            {tabOptions.map((option, index) => {
              /*
                Do not show the 'ECL Script' tab if the source type is not 'ecl'
                Do not show the 'Group By' tab if the chart selected doesn't support group by
                Do not show the Parameters' or 'group by' tab if the chart type is a static textbox
              */
              if (
                (sourceType !== 'ecl' && option === 'ECL Script') ||
                (!hasGroupByOption(type) && option === 'Group By') ||
                (type === 'textBox' && isStatic && option === 'Parameters') ||
                (type === 'textBox' && option === 'Group By')
              ) {
                return null;
              }

              return <Tab key={index} label={option} className={tab} />;
            })}
          </Tabs>
        </AppBar>
        {(() => {
          // Get correct position based on source type and tab index
          // If sourceType === 'ecl', skip parameters tab
          const tabNum = sourceType !== 'ecl' ? tabIndex + 1 : tabIndex;

          switch (tabNum) {
            case 0:
              return <ECLEditor {...props} clusterID={clusterID} clusterURL={clusterURL} eclRef={eclRef} />;
            case 1:
              return <General {...props} updateAxisKey={updateAxisKey} />;
            case 2:
              return <Parameters {...props} />;
            case 3:
              return <GroupBy {...props} updateAxisKey={updateAxisKey} />;
            default:
              return 'Unknown Tab';
          }
        })()}
      </Grid>
      <Grid item xs={6}>
        <Chart
          chart={{ config: newConfig }}
          dataObj={chartData}
          sourceType={sourceType}
          eclDataset={eclDataset}
          inEditor={true}
        />
      </Grid>
    </Grid>
  );
};

export default ChartEditor;
