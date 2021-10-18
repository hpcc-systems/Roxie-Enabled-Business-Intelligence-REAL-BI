import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import {
  AvTimer as AvTimerIcon,
  BarChart as BarChartIcon,
  DonutLarge as DonutChartIcon,
  Timeline as LineChartIcon,
  MultilineChart as MultilineChartIcon,
  PieChart as PieChartIcon,
  Public as PublicIcon,
  ScatterPlot as ScatterPlotIcon,
  Poll as PollIcon,
  TableChart as TableChartIcon,
  TextFields as TextFieldsIcon,
  ViewComfy as HeatmapIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import ColumnLineIcon from '../../../assets/images/ColumnLine.png';

// React Components
import DualAxesParams from './DualAxesParams';
import GaugeParams from './GaugeParams';
import GeneralParams from './GeneralParams';
import HeatmapParams from './HeatmapParams';
import HistogramParams from './HistogramParams';
import MapParams from './MapParams';
import PieParams from './PieParams';
import TableParams from './Table/TableParams';
import TextBoxParams from './TextBoxParams';

// Utils
import { hasHorizontalOption, hasDataLabelOption, hasDynamicOption } from '../../../utils/misc';
import { changeChartType } from '../../../utils/chart';

const charts = [
  { name: 'Bar', value: 'bar' },
  { name: 'Dual Axes Column-Line', value: 'columnline' },
  { name: 'Donut', value: 'donut' },
  { name: 'Dual Axes Line', value: 'dualline' },
  { name: 'Gauge', value: 'gauge' },
  { name: 'Heatmap', value: 'heatmap' },
  { name: 'Histogram', value: 'histogram' },
  { name: 'Line', value: 'line' },
  { name: 'Map', value: 'map' },
  { name: 'Pie', value: 'pie' },
  { name: 'Scatter', value: 'scatter' },
  { name: 'Table', value: 'table' },
  { name: 'Text Box', value: 'textBox' },
];

const useStyles = makeStyles(theme => ({
  menuIcon: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  staticCheckbox: {
    marginTop: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      '& span': {
        padding: '3px 0 0',
      },
    },
  },
  svgIcon: {
    marginRight: theme.spacing(1),
    width: 20,
  },
  topCheckbox: {
    margin: theme.spacing(2, 0, 0, 0),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      flexDirection: 'row',
      '& span': {
        padding: '3px 0 0',
      },
    },
  },
  topCheckbox2: {
    margin: 0,
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      flexDirection: 'row',
      '& span': {
        padding: '3px 0 0',
      },
    },
  },
  topFormControl: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      padding: 0,
    },
  },
}));

const GeneralTab = props => {
  const { handleChange, handleChangeObj, handleCheckbox, localState } = props;
  const { configuration } = localState;
  const {
    axis1,
    axis2,
    chartDescription,
    horizontal,
    isStatic,
    showDataLabels,
    showDataLabels2,
    showLastExecuted,
    title,
    type,
  } = configuration;
  const { topCheckbox, topCheckbox2, menuIcon, staticCheckbox, svgIcon, topFormControl } = useStyles();

  const checkboxUpdated = event => {
    const { name, checked } = event.target;
    const [state, key] = name.split(':');
    let newConfig = configuration;

    switch (key) {
      case 'showTickLabels':
        newConfig = { ...newConfig, [state]: { ...newConfig[state], [key]: checked } };
        handleChange(null, { name: 'configuration', value: newConfig });
        break;
      case 'horizontal':
        newConfig = { ...newConfig, [key]: checked };

        // Switch X and Y axis if they are already defined in local state
        if (axis1.value && axis2.value) {
          // Switch axis objects
          newConfig.axis1 = axis2;
          newConfig.axis2 = axis1;
        }

        handleChange(null, { name: 'configuration', value: newConfig });
        break;
      default:
        // Update local state
        handleCheckbox(event);
    }
  };

  const handleTypeChange = event => {
    const newConfig = changeChartType(event.target.value, configuration);

    handleChange(null, { name: 'configuration', value: newConfig });
  };

  const isDualAxesChart = type === 'columnline' || type === 'dualline';

  return (
    <>
      {/* FIRST ROW */}
      <Grid container wrap='wrap' spacing={1}>
        <Grid
          item
          xs={12}
          sm={
            hasHorizontalOption(type) || hasDynamicOption(type)
              ? hasDataLabelOption(type)
                ? isDualAxesChart
                  ? 3
                  : 6
                : 9
              : hasDataLabelOption(type)
              ? isDualAxesChart
                ? 6
                : 9
              : 12
          }
          className={topFormControl}
        >
          <FormControl fullWidth>
            <InputLabel>Chart Type</InputLabel>
            <Select name='configuration:type' value={type} onChange={handleTypeChange}>
              {charts.map(({ name, value }, index) => {
                return (
                  <MenuItem key={index} value={value}>
                    {(() => {
                      switch (value) {
                        case 'bar':
                          return <BarChartIcon className={menuIcon} />;
                        case 'columnline':
                          return <img src={ColumnLineIcon} className={svgIcon} />;
                        case 'donut':
                          return <DonutChartIcon className={menuIcon} />;
                        case 'dualline':
                          return <MultilineChartIcon className={menuIcon} />;
                        case 'histogram':
                          return <PollIcon className={menuIcon} />;
                        case 'heatmap':
                          return <HeatmapIcon className={menuIcon} />;
                        case 'gauge':
                          return <AvTimerIcon className={menuIcon} />;
                        case 'line':
                          return <LineChartIcon className={menuIcon} />;
                        case 'map':
                          return <PublicIcon className={menuIcon} />;
                        case 'pie':
                          return <PieChartIcon className={menuIcon} />;
                        case 'scatter':
                          return <ScatterPlotIcon className={menuIcon} />;
                        case 'table':
                          return <TableChartIcon className={menuIcon} />;
                        case 'textBox':
                          return <TextFieldsIcon className={menuIcon} />;
                        default:
                          return null;
                      }
                    })()}
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        {hasHorizontalOption(type) && (
          <Grid item xs={12} sm={3} className={topFormControl}>
            <FormControlLabel
              className={topCheckbox}
              control={
                <Checkbox
                  name='configuration:horizontal'
                  checked={horizontal || false}
                  onChange={checkboxUpdated}
                  color='primary'
                />
              }
              label='Horizontal'
              labelPlacement='end'
            />
          </Grid>
        )}
        {hasDynamicOption(type) && (
          <Grid item xs={12} sm={3} className={topFormControl}>
            <FormControlLabel
              className={staticCheckbox}
              control={
                <Checkbox
                  name='configuration:isStatic'
                  checked={isStatic || false}
                  onChange={checkboxUpdated}
                  color='primary'
                />
              }
              label='Static'
              labelPlacement='end'
            />
          </Grid>
        )}
        {hasDataLabelOption(type) && (
          <Grid item xs={12} sm={3} className={topFormControl}>
            <FormControlLabel
              className={clsx(topCheckbox, { [topCheckbox2]: isDualAxesChart })}
              control={
                <Checkbox
                  name='configuration:showDataLabels'
                  checked={showDataLabels || false}
                  onChange={checkboxUpdated}
                  color='primary'
                />
              }
              label={
                type === 'columnline'
                  ? 'Data Labels (Column)'
                  : type === 'dualline'
                  ? 'Data Labels (Line)'
                  : 'Data Labels'
              }
              labelPlacement={isDualAxesChart ? 'top' : 'end'}
            />
          </Grid>
        )}
        {hasDataLabelOption(type) && isDualAxesChart && (
          <Grid item xs={12} sm={3} className={topFormControl}>
            <FormControlLabel
              className={topCheckbox2}
              control={
                <Checkbox
                  name='configuration:showDataLabels2'
                  checked={showDataLabels2 || false}
                  onChange={checkboxUpdated}
                  color='primary'
                />
              }
              label={
                type === 'columnline'
                  ? 'Data Labels (Line)'
                  : type === 'dualline'
                  ? 'Data Labels (Line 2)'
                  : 'Data Labels'
              }
              labelPlacement='top'
            />
          </Grid>
        )}
      </Grid>
      {/* END FIRST ROW  */}
      {/* SECOND ROW */}
      <Grid container wrap='wrap'>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label='Chart Title'
            name='configuration:title'
            value={title || ''}
            onChange={handleChangeObj}
            autoComplete='off'
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            className={topCheckbox}
            control={
              <Checkbox
                name='configuration:showLastExecuted'
                checked={showLastExecuted || false}
                onChange={checkboxUpdated}
                color='primary'
              />
            }
            label='Show Last Executed'
            labelPlacement='end'
          />
        </Grid>
      </Grid>
      {/* END SECOND ROW */}
      {/* THIRD ROW */}
      <TextField
        fullWidth
        label='Chart Description (Optional)'
        name='configuration:chartDescription'
        value={chartDescription || ''}
        onChange={handleChangeObj}
        autoComplete='off'
      />
      {/*END THIRD ROW */}
      {/* FOURTH ROW */}
      <Grid container wrap='wrap'>
        {type === 'dualline' || type === 'columnline' ? (
          <DualAxesParams {...props} checkboxUpdated={checkboxUpdated} />
        ) : type === 'gauge' ? (
          <GaugeParams {...props} />
        ) : type === 'heatmap' ? (
          <HeatmapParams {...props} />
        ) : type === 'histogram' ? (
          <HistogramParams {...props} />
        ) : type === 'pie' || type === 'donut' ? (
          <PieParams {...props} />
        ) : type === 'map' ? (
          <MapParams {...props} />
        ) : type === 'table' ? (
          <TableParams {...props} />
        ) : type === 'textBox' ? (
          <TextBoxParams {...props} />
        ) : (
          <GeneralParams {...props} checkboxUpdated={checkboxUpdated} />
        )}
      </Grid>
      {/* END FOURTH ROW */}
    </>
  );
};

export default GeneralTab;
