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
import { ECLEditor, General, GroupBy, Parameters, RelationMapper } from './Tabs';
import Chart from '../Chart';

// Constants
import { hasGroupByOption } from '../../utils/misc';
import { sourceOptions } from '../../constants';

const tabOptions = ['ECL Script', 'General', 'Parameters', 'Group By', 'Relations'];

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { marginBottom: theme.spacing(1) },
  formControl: { marginBottom: theme.spacing(3) },
  gridContainer: { overflowY: 'hidden' },
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
  const { clusterHost, clusterPort } = dashboard;
  const { chartID, config, dataObj, dataset, error, sourceType } = localState;
  const { data: eclData = {}, dataset: eclDataset } = eclRef.current;
  let { isStatic, type } = config;
  isStatic = type !== 'textBox' || isStatic === 'undefined' ? false : isStatic;

  const [tabIndex, setTabIndex] = useState(0);
  const { appbar, formControl, gridContainer, typography } = useStyles();

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  const changeSourceType = event => {
    handleChange(null, { name: 'selectedSource', value: {} });
    handleChange(event);
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
                Do not show the Parameters' tab if the source type is 'ecl'
                Do not show the 'Group By' tab if the chart selected doesn't support group by
                Do not show the Parameters' or 'group by' tab if the chart type is a static textbox
              */
              if (
                (sourceType !== 'ecl' && option === 'ECL Script') ||
                (sourceType === 'ecl' && option === 'Parameters') ||
                (!hasGroupByOption(type) && option === 'Group By') ||
                (type === 'textBox' && isStatic && (option === 'Parameters' || option === 'Relations')) ||
                (type === 'textBox' && option === 'Group By')
              ) {
                return null;
              }

              return <Tab key={index} label={option} />;
            })}
          </Tabs>
        </AppBar>
        {(() => {
          let tabNum = tabIndex;

          // Get correct position based on type and tab index
          if (sourceType !== 'ecl') {
            // source type !== 'ecl', skip ecl tab
            tabNum += 1;

            if (tabNum === 3 && !hasGroupByOption(type)) {
              // chart type doesn't support group by, skip group by tab
              tabNum = 4;
            }
          } else {
            if (tabNum === 2) {
              if (!hasGroupByOption(type)) {
                // chart type doesn't support group by, skip parameters and group by tabs
                tabNum = 4;
              } else {
                // source type === 'ecl', skip parameters tab
                tabNum = 3;
              }
            } else if (tabNum > 2) {
              // Last option, show relation mapper
              tabNum = 4;
            }
          }

          switch (tabNum) {
            case 0:
              return <ECLEditor clusterURL={clusterURL} eclRef={eclRef} />;
            case 1:
              return <General {...props} />;
            case 2:
              return <Parameters {...props} />;
            case 3:
              return <GroupBy {...props} />;
            case 4:
              return <RelationMapper {...props} />;
            default:
              return 'Unknown Tab';
          }
        })()}
      </Grid>
      <Grid item xs={6}>
        <Chart chart={{ config: newConfig }} dataObj={chartData} eclDataset={eclDataset} />
      </Grid>
    </Grid>
  );
};

export default ChartEditor;
