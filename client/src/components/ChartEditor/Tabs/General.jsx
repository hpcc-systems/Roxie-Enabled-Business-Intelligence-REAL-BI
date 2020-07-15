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
  BarChart as BarChartIcon,
  Timeline as LineChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
} from '@material-ui/icons';
import classnames from 'classnames';

// React Components
import GeneralParams from './GeneralParams';
import PieParams from './PieParams';
import TableParams from './TableParams';

// Utils
import { hasHorizontalOption } from '../../../utils/misc';
import { changeChartType } from '../../../utils/chart';

const charts = [
  { name: 'Bar', value: 'bar' },
  { name: 'Line', value: 'line' },
  { name: 'Pie', value: 'pie' },
  { name: 'Table', value: 'table' },
];

const useStyles = makeStyles(theme => ({
  checkbox: { marginTop: theme.spacing(0.25), marginLeft: theme.spacing(2) },
  formControl: { marginTop: theme.spacing(1) },
  menuIcon: { marginRight: 10 },
  topFormControl: { marginTop: theme.spacing(3) },
}));

const GeneralTab = ({ handleChange, handleChangeObj, handleCheckbox, localState }) => {
  const {
    chartType,
    options: { horizontal, title, chartDescription, xAxis, yAxis },
  } = localState;
  const { checkbox, formControl, menuIcon, topFormControl } = useStyles();

  const checkboxUpdated = event => {
    const { name } = event.target;

    // Update local state
    handleCheckbox(event);

    // Switch X and Y axis if they are already defined in local state
    if (name === 'options:horizontal' && xAxis && yAxis) {
      const xVal = xAxis;
      const yVal = yAxis;

      handleChangeObj(null, { name: 'options:xAxis', value: yVal });
      handleChangeObj(null, { name: 'options:yAxis', value: xVal });
    }
  };

  const handleTypeChange = event => {
    const { chartType, options } = localState;
    const newOptions = changeChartType(chartType, event.target.value, options);

    handleChange(null, { name: 'options', value: newOptions });
    handleChange(event);
  };

  return (
    <Grid container direction='row' alignContent='space-between'>
      <Grid item md={hasHorizontalOption(chartType) ? 10 : 12} className={topFormControl}>
        <FormControl className={classnames('', { [formControl]: !hasHorizontalOption(chartType) })} fullWidth>
          <InputLabel>Chart Type</InputLabel>
          <Select name='chartType' value={chartType} onChange={handleTypeChange}>
            {charts.map(({ name, value }, index) => {
              return (
                <MenuItem key={index} value={value}>
                  {(() => {
                    switch (value) {
                      case 'bar':
                        return <BarChartIcon className={menuIcon} />;
                      case 'line':
                        return <LineChartIcon className={menuIcon} />;
                      case 'pie':
                        return <PieChartIcon className={menuIcon} />;
                      case 'table':
                        return <TableChartIcon className={menuIcon} />;
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
      {hasHorizontalOption(chartType) && (
        <Grid item md={2} className={topFormControl}>
          <FormControlLabel
            className={checkbox}
            control={
              <Checkbox
                name='options:horizontal'
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
      <Grid item md={12} className={classnames('', { [formControl]: !hasHorizontalOption(chartType) })}>
        <TextField
          fullWidth
          label='Chart Title'
          name='options:title'
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
          name='options:chartDescription'
          value={chartDescription || ''}
          onChange={handleChangeObj}
          autoComplete='off'
        />
      </Grid>
      {chartType === 'pie' ? (
        <PieParams handleChangeObj={handleChangeObj} localState={localState} />
      ) : chartType === 'table' ? (
        <TableParams handleChangeObj={handleChangeObj} localState={localState} />
      ) : (
        <GeneralParams handleChangeObj={handleChangeObj} localState={localState} />
      )}
    </Grid>
  );
};

export default GeneralTab;
