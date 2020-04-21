import React, { useCallback } from 'react';
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
  ClearAll as ClearAllIcon,
  Timeline as LineChartIcon,
  PieChart as PieChartIcon,
} from '@material-ui/icons';

// React Components
import GeneralChartParams from './GeneralChartParams';

// Constants
import { hasHorizontalOption, hasStackedOption } from '../../../constants';

const charts = [
  { name: 'Bar', value: 'bar' },
  { name: 'Line', value: 'line' },
  { name: 'Pie', value: 'pie' },
  { name: 'Range', value: 'range' },
];

const useStyles = makeStyles(() => ({
  formControl: { marginTop: 25 },
  menuIcon: { marginRight: 10 },
}));

const GeneralTab = ({ handleChange, handleChangeObj, localState }) => {
  const {
    chartType,
    options: { horizontal, stacked, title, xAxis, yAxis },
  } = localState;
  const { formControl, menuIcon } = useStyles();

  const handleCheckbox = useCallback(
    event => {
      const { name, checked } = event.target;

      // Update local state
      handleChangeObj(null, { name, value: checked });

      // Switch X and Y axis if they are already defined in local state
      if (name === 'options:horizontal' && xAxis && yAxis) {
        const xVal = xAxis;
        const yVal = yAxis;

        handleChangeObj(null, { name: 'options:xAxis', value: yVal });
        handleChangeObj(null, { name: 'options:yAxis', value: xVal });
      }
    },
    [handleChangeObj, xAxis, yAxis],
  );

  return (
    <Grid container direction='row' alignContent='space-between'>
      <Grid item md={hasStackedOption(chartType) ? 8 : hasHorizontalOption(chartType) ? 10 : 12}>
        <FormControl className={formControl} fullWidth>
          <InputLabel>Chart Type</InputLabel>
          <Select name='chartType' value={chartType} onChange={handleChange}>
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
                      case 'range':
                        return <ClearAllIcon className={menuIcon} />;
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
        <Grid item md={2}>
          <FormControlLabel
            className={formControl}
            control={
              <Checkbox
                name='options:horizontal'
                checked={horizontal || false}
                onChange={handleCheckbox}
                color='primary'
              />
            }
            label='Horizontal'
            labelPlacement='top'
          />
        </Grid>
      )}
      {hasStackedOption(chartType) && (
        <Grid item md={2}>
          <FormControlLabel
            className={formControl}
            control={
              <Checkbox
                name='options:stacked'
                checked={stacked || false}
                onChange={handleCheckbox}
                color='primary'
              />
            }
            label='Stacked'
            labelPlacement='top'
          />
        </Grid>
      )}
      <Grid item md={12}>
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
        <GeneralChartParams handleChangeObj={handleChangeObj} localState={localState} />
      </Grid>
    </Grid>
  );
};

export default GeneralTab;
