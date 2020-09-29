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
import classnames from 'classnames';

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
import { hasHorizontalOption, hasDynamicOption } from '../../../utils/misc';
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
  formControl: { marginTop: theme.spacing(1) },
  horizontalCheckbox: { marginTop: theme.spacing(0.25), marginLeft: theme.spacing(2) },
  menuIcon: { marginRight: 10 },
  staticCheckbox: { marginTop: theme.spacing(1.5), marginLeft: theme.spacing(4) },
  topFormControl: { marginTop: theme.spacing(3) },
}));

const GeneralTab = props => {
  const { handleChange, handleChangeObj, handleCheckbox, localState } = props;
  const { config } = localState;
  const { axis1, axis2, horizontal, isStatic, title, chartDescription, type } = config;
  const { formControl, horizontalCheckbox, menuIcon, staticCheckbox, topFormControl } = useStyles();

  const checkboxUpdated = event => {
    const { name, checked } = event.target;
    const [state, key] = name.split(':');
    let newConfig = config;

    switch (key) {
      case 'showTickLabels':
        newConfig = { ...newConfig, [state]: { ...newConfig[state], [key]: checked } };
        handleChange(null, { name: 'config', value: newConfig });
        break;
      case 'horizontal':
        newConfig = { ...newConfig, [key]: checked };

        // Switch X and Y axis if they are already defined in local state
        if (axis1.value && axis2.value) {
          // Switch axis objects
          newConfig.axis1 = axis2;
          newConfig.axis2 = axis1;
        }

        handleChange(null, { name: 'config', value: newConfig });
        break;
      default:
        // Update local state
        handleCheckbox(event);
    }
  };

  const handleTypeChange = event => {
    const newConfig = changeChartType(type, event.target.value, config);

    handleChange(null, { name: 'config', value: newConfig });
  };

  return (
    <Grid container direction='row' alignContent='space-between'>
      <Grid
        item
        md={hasHorizontalOption(type) || hasDynamicOption(type) ? 10 : 12}
        className={topFormControl}
      >
        <FormControl className={classnames('', { [formControl]: !hasHorizontalOption(type) })} fullWidth>
          <InputLabel>Chart Type</InputLabel>
          <Select name='config:type' value={type} onChange={handleTypeChange}>
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
        <Grid item md={2} className={topFormControl}>
          <FormControlLabel
            className={horizontalCheckbox}
            control={
              <Checkbox
                name='config:horizontal'
                checked={horizontal || false}
                onChange={checkboxUpdated}
                color='primary'
              />
            }
            label='Horizontal'
            labelPlacement='top'
          />
        </Grid>
      )}
      {hasDynamicOption(type) && (
        <Grid item md={2} className={topFormControl}>
          <FormControlLabel
            className={staticCheckbox}
            control={
              <Checkbox
                name='config:isStatic'
                checked={isStatic || false}
                onChange={checkboxUpdated}
                color='primary'
              />
            }
            label='Static'
            labelPlacement='top'
          />
        </Grid>
      )}
      <Grid item md={12} className={classnames('', { [formControl]: !hasHorizontalOption(type) })}>
        <TextField
          fullWidth
          label='Chart Title'
          name='config:title'
          value={title || ''}
          onChange={handleChangeObj}
          autoComplete='off'
        />
      </Grid>
      <Grid item md={12}>
        <TextField
          className={formControl}
          fullWidth
          label='Chart Description (Optional)'
          name='config:chartDescription'
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
