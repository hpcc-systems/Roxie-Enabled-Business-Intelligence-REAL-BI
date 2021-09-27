import React, { Fragment } from 'react';
import {
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { getMessage } from '../../../utils/misc';
import { dataTypes, messages } from '../../../constants';
import DataTypeDropdown from './DataTypeDropdown';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  progress: { margin: 0, marginTop: 50 },
  checkbox: {
    margin: theme.spacing(2.5, 0, 0, 0.5),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      '& span': {
        padding: '3px 0 0',
      },
    },
  },
}));

const AxisConfigOptions = props => {
  const {
    checkboxUpdated,
    eclRef: {
      current: { schema = [] },
    },
    field,
    helperText,
    label,
    localState: { chartID, configuration, error = '', selectedDataset: { fields = [] } = {}, sourceType },
    showDataTypeOption,
    showAxisLabelOption,
    showLabelOption,
    updateAxisKey,
  } = props;
  const { formControl, progress, checkbox } = useStyles();

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  return (
    <Fragment>
      <Grid item xs={12} sm>
        <FormControl required className={formControl} fullWidth>
          <InputLabel>{label}</InputLabel>
          {chartID && messages.indexOf(fieldsArr[0].name) > -1 && error === '' ? (
            <CircularProgress className={progress} size={20} />
          ) : (
            <Select
              name={`${field}:value`}
              value={configuration?.[field]?.value || ''}
              onChange={updateAxisKey}
            >
              {fieldsArr.map(({ name, value = name }, index) => {
                return (
                  <MenuItem key={index} value={value}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
          )}
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      </Grid>
      {showAxisLabelOption && (
        <Grid item xs={12} sm>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='Label'
              name={`${field}:label`}
              value={configuration?.[field]?.label || ''}
              onChange={updateAxisKey}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
      )}
      {showDataTypeOption && (
        <Grid item xs={12} sm>
          <DataTypeDropdown
            className={formControl}
            handleChange={updateAxisKey}
            label='Data Type'
            name={`${field}:type`}
            value={configuration?.[field]?.type}
            valuesArr={dataTypes}
          />
        </Grid>
      )}
      {showLabelOption && (
        <Grid item xs={12} sm>
          <FormControlLabel
            control={
              <Checkbox
                checked={configuration?.[field]?.showTickLabels}
                onChange={checkboxUpdated}
                name={`${field}:showTickLabels`}
              />
            }
            className={checkbox}
            label='Show Labels'
          />
        </Grid>
      )}
    </Fragment>
  );
};

AxisConfigOptions.defaultProps = {
  checkboxUpdated: () => {},
  eclRef: {},
  helperText: '',
  showAxisLabelOption: true,
  showDataTypeOption: true,
  showLabelOption: true,
};

AxisConfigOptions.propTypes = {
  checkboxUpdated: PropTypes.func,
  eclRef: PropTypes.shape({
    current: PropTypes.shape({
      schema: PropTypes.array,
    }),
  }),
  field: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  label: PropTypes.string.isRequired,
  localState: PropTypes.shape({
    chartID: PropTypes.string,
    configuration: PropTypes.object,
    error: PropTypes.string,
    selectedDataset: PropTypes.shape({
      fields: PropTypes.array,
    }),
    sourceType: PropTypes.string.isRequired,
  }).isRequired,
  showAxisLabelOption: PropTypes.bool,
  showDataTypeOption: PropTypes.bool,
  showLabelOption: PropTypes.bool,
  updateAxisKey: PropTypes.func.isRequired,
};

export default AxisConfigOptions;
