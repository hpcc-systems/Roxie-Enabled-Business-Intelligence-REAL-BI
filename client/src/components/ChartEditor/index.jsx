import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Box,
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
import { ECLEditor, General, GroupBy, Parameters, SortBy, TableConditionalFormatting } from './Tabs';
import Chart from '../Chart';
import DuplicateRecordsWarning from './DuplicateRecordsWarning';

// Constants
import { hasGroupByOption, hasSortOptions } from '../../utils/misc';
import { sourceOptions } from '../../constants';

const tabOptions = ['ECL Script', 'General', 'Parameters', 'Group By', 'Sort By', 'Conditional Formatting'];

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { marginBottom: theme.spacing(1) },
  formControl: { marginBottom: theme.spacing(3) },
  gridContainer: { height: '75vh' },
  typography: {
    ...theme.typography.button,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
  },
  splitScreen: {
    height: 'inherit',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: '5px',
    },
  },
}));

const ChartEditor = props => {
  const { eclRef, handleChange, formFieldsUpdate, localState, initialChartFormFields } = props;
  const { chartID, configuration, dataObj, dataset, error, sourceType } = localState;
  const { data: eclData, dataset: eclDataset, toggleUpdate = false, loading: eclLoading } = eclRef.current;
  const { isStatic = false, type } = configuration;

  const [tabIndex, setTabIndex] = useState(0);
  const [tabPercentage, setTabPercentage] = useState('');
  const [duplicatedRecords, setDuplicatedRecords] = useState([]);

  const { appbar, formControl, gridContainer, typography, splitScreen } = useStyles();

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  const changeSourceType = event => {
    formFieldsUpdate({
      ...initialChartFormFields,
      sourceType: event.target.value,
    });
  };

  const updateAxisKey = event => {
    const { name, value } = event.target;
    const [state, key] = name.split(':');
    let newConfig = localState.configuration;

    // Update object key
    newConfig = { ...newConfig, [state]: { ...newConfig[state], [key]: value } };

    return handleChange(null, { name: 'configuration', value: newConfig });
  };

  // Memoized all values to avoid component rerender on each key hit
  let chartData;
  // If ECL Ref has data, use that array
  if (sourceType === 'ecl') {
    chartData = { data: eclData || [], error: '', loading: eclLoading };
  } else {
    chartData = { ...dataObj.data, error: '', loading: dataObj.loading };
  }

  const memo = React.useMemo(
    () => ({
      chartConfig: { configuration: { ...configuration, dataset } },
      chartData,
      eclDataset,
      sourceType,
    }),
    [dataObj.loading, eclData, toggleUpdate],
  );

  useEffect(() => {
    // Get percentage of tab width
    if (sourceType === 'ecl') {
      if (!hasGroupByOption(type) && !hasSortOptions(type)) {
        if (type === 'table') {
          setTabPercentage('25%');
        } else {
          setTabPercentage('33.3%');
        }
      } else if (!hasGroupByOption(type) || !hasSortOptions(type)) {
        setTabPercentage('25%');
      } else {
        setTabPercentage('20%');
      }
    } else {
      if (type !== 'textBox') {
        if (!hasGroupByOption(type) && !hasSortOptions(type)) {
          if (type === 'table') {
            setTabPercentage('33.3%');
          } else {
            setTabPercentage('50%');
          }
        } else if (!hasGroupByOption(type) || !hasSortOptions(type)) {
          setTabPercentage('33.3%');
        } else {
          setTabPercentage('25%');
        }
      } else {
        if (isStatic) {
          setTabPercentage('100%');
        } else {
          setTabPercentage('50%');
        }
      }
    }
  }, [isStatic, sourceType, type]);

  const showDuplicatedRecordsWarning = useCallback(
    duplicates => {
      setDuplicatedRecords(duplicates);
    },
    [dataObj.loading],
  );

  return (
    <Grid container spacing={4} className={gridContainer}>
      <Grid item xs={6} className={splitScreen}>
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
                Do not show the 'Parameters' tab if the chart type is a static textbox
                Do not show the 'Sort By' tab if the chart selected doesn't support sort by
              */
              if (
                (sourceType !== 'ecl' && option === 'ECL Script') ||
                (!hasGroupByOption(type) && option === 'Group By') ||
                (type === 'textBox' && isStatic && option === 'Parameters') ||
                (!hasSortOptions(type) && option === 'Sort By') ||
                (type !== 'table' && option === 'Conditional Formatting')
              ) {
                return null;
              }

              return (
                <Tab
                  key={index}
                  label={option}
                  style={{ maxWidth: tabPercentage, minWidth: tabPercentage }}
                />
              );
            })}
          </Tabs>
        </AppBar>
        {(() => {
          // Get correct position based on source type and tab index
          // If sourceType === 'ecl', skip parameters tab
          // Skip groupby tab for sortby tab if necessary
          let tabNum = tabIndex;

          if (sourceType !== 'ecl') {
            if (!hasGroupByOption(type) && hasSortOptions(type) && tabIndex > 1) {
              tabNum = tabIndex + 2;
            } else {
              if (type === 'table') {
                tabNum = tabIndex >= 2 ? tabIndex + 3 : tabIndex + 1;
              } else {
                tabNum = tabIndex + 1;
              }
            }
          } else {
            if (!hasGroupByOption(type) && hasSortOptions(type) && tabIndex > 2) {
              if (tabIndex > 3) {
                tabNum = tabIndex + 2;
              } else {
                tabNum = tabIndex + 1;
              }
            } else {
              if (tabIndex >= 3 && type === 'table') {
                tabNum = tabIndex + 2;
              }
            }
          }

          switch (tabNum) {
            case 0:
              return <ECLEditor {...props} />;
            case 1:
              return <General {...props} updateAxisKey={updateAxisKey} />;
            case 2:
              return <Parameters {...props} />;
            case 3:
              return <GroupBy {...props} updateAxisKey={updateAxisKey} />;
            case 4:
              return <SortBy {...props} updateAxisKey={updateAxisKey} />;
            case 5:
              return <TableConditionalFormatting {...props} updateAxisKey={updateAxisKey} />;
            default:
              return 'Unknown Tab';
          }
        })()}
      </Grid>
      <Grid item xs={6} className={splitScreen}>
        <Box display='flex' flexDirection='column' height='100%'>
          <Box flexGrow='1' maxHeight={duplicatedRecords.length > 0 ? '90%' : '100%'}>
            <Box height='100%'>
              <Chart
                chart={memo.chartConfig}
                dataObj={memo.chartData}
                sourceType={memo.sourceType}
                eclDataset={memo.eclDataset}
                showDuplicatedRecordsWarning={showDuplicatedRecordsWarning}
              />
            </Box>
          </Box>
          {duplicatedRecords.length > 0 && <DuplicateRecordsWarning duplicatedRecords={duplicatedRecords} />}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ChartEditor;
