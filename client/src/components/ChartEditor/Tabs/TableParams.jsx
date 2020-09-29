import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, Grid, Input, InputLabel, MenuItem, Select } from '@material-ui/core';

// Utils
import { getMessage } from '../../../utils/misc';

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0` },
  progress: { margin: 0, marginTop: 50 },
}));

const TableParams = ({ eclRef, handleChangeObj, localState }) => {
  const { schema = [] } = eclRef.current;
  const { chartID, config, selectedDataset = {}, sourceType } = localState;
  const { fields = [] } = selectedDataset;
  const { fields: configFields = [] } = config;
  const { formControl, progress } = useStyles();

  const updateArr = ({ target }) => {
    const { name, value } = target;
    handleChangeObj(null, { name, value: value });
  };

  const fieldsArr =
    schema.length > 0 ? schema : !fields ? [{ name: getMessage(sourceType), value: '' }] : fields;

  return (
    <Grid item md={12}>
      <FormControl className={formControl} fullWidth>
        <InputLabel>Fields</InputLabel>
        {chartID && fields.length <= 1 ? (
          <CircularProgress className={progress} size={20} />
        ) : (
          <Select multiple name='config:fields' value={configFields} input={<Input />} onChange={updateArr}>
            {fieldsArr.map(({ name }, index) => {
              return (
                <MenuItem key={index} value={name}>
                  {name}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </FormControl>
    </Grid>
  );
};

export default TableParams;
