import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';

// React Components
import SourceSearch from './SourceSearch';
import SelectDataset from './SelectDataset';

// Utils
import { getMessage } from '../../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  errorText: { color: theme.palette.error.dark },
  formControl: { marginBottom: theme.spacing(1) },
}));

const SourceTab = props => {
  const { eclRef, handleChange, localState } = props;
  const { schema = [] } = eclRef.current;
  const { errors = [], selectedDataset = {}, sourceField, sourceType } = localState;
  const { fields = [] } = selectedDataset;
  const { errorText, formControl } = useStyles();

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];
  const sourceFieldErr = errors.find(err => err['sourceField']);

  return (
    <Fragment>
      {sourceType !== 'ecl' && (
        <Fragment>
          <SourceSearch {...props} />
          <SelectDataset {...props} />
        </Fragment>
      )}
      <Grid item xs={12}>
        <FormControl fullWidth className={formControl}>
          <InputLabel>Field</InputLabel>
          <Select
            name='sourceField'
            value={sourceField}
            onChange={handleChange}
            error={sourceFieldErr !== undefined}
            disabled={!localState.isFilterReady}
          >
            {fieldsArr.map(({ name, value = name }, index) => {
              return (
                <MenuItem key={index} value={value}>
                  {name}
                </MenuItem>
              );
            })}
          </Select>
          {sourceFieldErr !== undefined && (
            <FormHelperText className={errorText}>{sourceFieldErr['sourceField']}</FormHelperText>
          )}
        </FormControl>
      </Grid>
    </Fragment>
  );
};

export default SourceTab;
