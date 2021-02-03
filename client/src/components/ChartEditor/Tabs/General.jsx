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
  ScatterPlot as ScatterPlotIcon,
  Poll as PollIcon,
  TableChart as TableChartIcon,
  TrendingFlat as HeatMapIcon,
} from '@material-ui/icons';
import TextFieldsIcon from '@material-ui/icons/TextFields';

// React Components
import DualLineParams from './DualLineParams';
import GaugeParams from './GaugeParams';
import GeneralParams from './GeneralParams';
import HeatMapParams from './HeatMapParams';
import HistogramParams from './HistogramParams';
import PieParams from './PieParams';
import TableParams from './TableParams';
import TextBoxParams from './TextBoxParams';

// Utils
import { hasHorizontalOption, hasDataLabelOption, hasDynamicOption } from '../../../utils/misc';
import { changeChartType } from '../../../utils/chart';

const charts = [
  { name: 'Bar', value: 'bar' },
  { name: 'Donut', value: 'donut' },
  { name: 'DualLine', value: 'dualline' },
  { name: 'Gauge', value: 'gauge' },
  { name: 'HeatMap', value: 'heatmap' },
  { name: 'Histogram', value: 'histogram' },
  { name: 'Line', value: 'line' },
  { name: 'Pie', value: 'pie' },
  { name: 'Scatter', value: 'scatter' },
  { name: 'Table', value: 'table' },
  { name: 'Text Box', value: 'textBox' },
];

const useStyles = makeStyles(theme => ({
  menuIcon: { marginRight: theme.spacing(1) },
  staticCheckbox: { marginTop: theme.spacing(1.5) },
  topCheckbox: { margin: theme.spacing(2, 0, 0, 0) },
  topFormControl: { marginTop: theme.spacing(3) },
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
    showLastExecuted,
    title,
    type,
  } = configuration;
  const { topCheckbox, menuIcon, staticCheckbox, topFormControl } = useStyles();

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
    const newConfig = changeChartType(type, event.target.value, configuration);

    handleChange(null, { name: 'configuration', value: newConfig });
  };

  return (
    <Grid container direction='row' alignContent='space-between' spacing={1}>
      <Grid
        item
        xs={
          hasHorizontalOption(type) || hasDynamicOption(type)
            ? hasDataLabelOption(type)
              ? 6
              : 9
            : hasDataLabelOption(type)
            ? 9
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
                      case 'donut':
                        return <DonutChartIcon className={menuIcon} />;
                      case 'dualline':
                        return <MultilineChartIcon className={menuIcon} />;
                      case 'histogram':
                        return <PollIcon className={menuIcon} />;
                      case 'heatmap':
                        return <HeatMapIcon className={menuIcon} />;
                      case 'gauge':
                        return <AvTimerIcon className={menuIcon} />;
                      case 'line':
                        return <LineChartIcon className={menuIcon} />;
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
        <Grid item xs={3} className={topFormControl}>
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
        <Grid item xs={3} className={topFormControl}>
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
        <Grid item xs={3} className={topFormControl}>
          <FormControlLabel
            className={topCheckbox}
            control={
              <Checkbox
                name='configuration:showDataLabels'
                checked={showDataLabels || false}
                onChange={checkboxUpdated}
                color='primary'
              />
            }
            label='Data Labels'
            labelPlacement='end'
          />
        </Grid>
      )}
      <Grid item xs={8}>
        <TextField
          fullWidth
          label='Chart Title'
          name='configuration:title'
          value={title || ''}
          onChange={handleChangeObj}
          autoComplete='off'
        />
      </Grid>
      <Grid item xs={4}>
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
      <Grid item xs={12}>
        <TextField
          fullWidth
          label='Chart Description (Optional)'
          name='configuration:chartDescription'
          value={chartDescription || ''}
          onChange={handleChangeObj}
          autoComplete='off'
        />
      </Grid>
      {type === 'dualline' ? (
        <DualLineParams {...props} />
      ) : type === 'gauge' ? (
        <GaugeParams {...props} />
      ) : type === 'heatmap' ? (
        <HeatMapParams {...props} />
      ) : type === 'histogram' ? (
        <HistogramParams {...props} />
      ) : type === 'pie' || type === 'donut' ? (
        <PieParams {...props} />
      ) : type === 'table' ? (
        <TableParams {...props} />
      ) : type === 'textBox' ? (
        <TextBoxParams {...props} />
      ) : (
        <GeneralParams {...props} checkboxUpdated={checkboxUpdated} />
      )}
    </Grid>
  );
};

export default GeneralTab;
