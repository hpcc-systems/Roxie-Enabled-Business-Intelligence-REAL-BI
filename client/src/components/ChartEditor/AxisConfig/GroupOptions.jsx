import React, { Fragment } from 'react';
import { CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { getMessage } from '../../../utils/misc';
import { dataTypes } from '../../../constants';
import DataTypeDropdown from './DataTypeDropdown';

const useStyles = makeStyles(theme => ({
  checkbox: { marginTop: theme.spacing(0.25), marginLeft: theme.spacing(2) },
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
}));

const GroupOptions = props => {
  const {
    children,
    eclRef: { current: { schema = [] } = {} },
    field,
    label,
    localState: { chartID, configuration, selectedDataset: { fields = [] } = {}, sourceType },
    updateAxisKey,
  } = props;
  const { formControl, progress } = useStyles();

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  return (
    <Fragment>
      <Grid item xs>
        <FormControl className={formControl} fullWidth>
          <InputLabel>{label}</InputLabel>
          {chartID && fieldsArr.length <= 1 ? (
            <CircularProgress className={progress} size={20} />
          ) : (
            <Select
              name={`${field}:value`}
              value={configuration?.[field]?.value || ''}
              onChange={updateAxisKey}
            >
              {configuration?.[field] !== '' && <MenuItem value=''>Clear Selection</MenuItem>}
              {fieldsArr.map(({ name, value = name }, index) => {
                return (
                  <MenuItem key={index} value={value}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <DataTypeDropdown
          className={formControl}
          handleChange={updateAxisKey}
          label='Data Type'
          name={`${field}:type`}
          value={configuration?.[field]?.type}
          valuesArr={dataTypes}
        />
      </Grid>

      {children || null}
    </Fragment>
  );
};

GroupOptions.defaultProps = {
  canStack: true,
  canUsePercentage: true,
  children: null,
  eclRef: {},
  handleCheckbox: () => {},
};

GroupOptions.propTypes = {
  canStack: PropTypes.bool,
  canUsePercentage: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  eclRef: PropTypes.shape({
    current: PropTypes.shape({
      schema: PropTypes.array,
    }),
  }),
  handleCheckbox: PropTypes.func,
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  localState: PropTypes.shape({
    chartID: PropTypes.string,
    configuration: PropTypes.object,
    selectedDataset: PropTypes.shape({
      fields: PropTypes.array,
    }),
    sourceType: PropTypes.string.isRequired,
  }).isRequired,
  updateAxisKey: PropTypes.func.isRequired,
};

export default GroupOptions;
