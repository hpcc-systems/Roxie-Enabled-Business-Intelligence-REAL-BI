import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0`, marginTop: 25 },
  formControl2: { margin: `${theme.spacing(1)}px 0` },
  menuIcon: { marginRight: 10 },
}));

const getXAxisLabel = (chartType) => {
	switch (chartType) {
  	case 'pie':
  		return 'Name'
  	default:
  		return 'X Axis'				
  }
}

const getYAxisLabel = (chartType) => {
	switch (chartType) {
  	case 'pie':
  		return 'Value'
  	default:
  		return 'Y Axis'				
  }
}

const GeneralChartParams = ({ handleChangeObj, chartType, options, selectedDataset }) => {
  const { fields = [{ name: 'Choose a dataset', value: '' }] } = selectedDataset;
  const { formControl, formControl2, menuIcon } = useStyles();

  return (
  	<Fragment>
  		<FormControl className={formControl2} fullWidth>
        <InputLabel>{getXAxisLabel(chartType)}</InputLabel>
        <Select name="options:xAxis" value={options.xAxis || ''} onChange={handleChangeObj}>
          {fields.map(({ name, value = name }, index) => {
            return (
              <MenuItem key={index} value={value}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl className={formControl2} fullWidth>
        <InputLabel>{getYAxisLabel(chartType)}</InputLabel>
        <Select name="options:yAxis" value={options.yAxis || ''} onChange={handleChangeObj}>
          {fields.map(({ name, value = name }, index) => {
            return (
              <MenuItem key={index} value={value}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Fragment>	
  );
};

export default GeneralChartParams;  
