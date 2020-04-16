import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Timeline as LineChartIcon,
  PieChart as PieChartIcon,
} from '@material-ui/icons';

// React Components
import GeneralChartParams from './GeneralChartParams';

const charts = [
  { name: 'Bar', value: 'bar' },
  { name: 'Line', value: 'line' },
  { name: 'Pie', value: 'pie' },
];

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0`, marginTop: 25 },
  formControl2: { margin: `${theme.spacing(1)}px 0` },
  menuIcon: { marginRight: 10 },
}));

const GeneralTab = ({ handleChange, handleChangeObj, localState }) => {
  const { chartType, options } = localState;
  const { formControl, formControl2, menuIcon } = useStyles();

  return (
    <Fragment>
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
      <TextField
        className={formControl2}
        fullWidth
        label='Chart Title'
        name='options:title'
        value={options.title || ''}
        onChange={handleChangeObj}
        autoComplete='off'
      />
      <GeneralChartParams handleChangeObj={handleChangeObj} localState={localState} />
    </Fragment>
  );
};

export default GeneralTab;
