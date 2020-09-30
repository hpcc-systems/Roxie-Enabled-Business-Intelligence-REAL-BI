import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, TextField, CircularProgress, InputLabel, Select } from '@material-ui/core';

// Utils
import { getMessage } from '../../../utils/misc';

// Constants
import { messages } from '../../../constants';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
  textfield: { paddingTop: theme.spacing(0.5) },
}));

const TextBoxParams = ({ eclRef, handleChangeObj, localState }) => {
  const { schema = [] } = eclRef.current;
  const {
    chartID,
    config: { dataFields, isStatic = false, textBoxContent },
    selectedDataset = {},
    sourceType,
  } = localState;
  const { fields = [] } = selectedDataset;
  const { formControl, progress, textfield } = useStyles();

  const updateArr = ({ target }) => {
    const { name, options } = target;

    // Convert HTMLOptionsCollection to iterable array
    const optionsArr = Array.apply(null, options).map(({ selected, value }) => ({ selected, value }));

    // Get selected option objects
    let arr = optionsArr.filter(({ selected }) => selected === true);
    arr = arr.map(({ value }) => value);

    handleChangeObj(null, { name, value: arr });
  };

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <Grid item md={!isStatic ? 8 : 12}>
          <FormControl className={formControl} fullWidth>
            <TextField
              className={textfield}
              fullWidth
              label='Text Box Content'
              multiline
              name='config:textBoxContent'
              value={textBoxContent || ''}
              rows={4}
              onChange={handleChangeObj}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
        {!isStatic && (
          <Grid item md={4}>
            <FormControl className={formControl} fullWidth>
              <InputLabel shrink htmlFor='dataFieldsDropdown'>
                Data Fields
              </InputLabel>
              {chartID && messages.indexOf(fieldsArr[0].name) > -1 ? (
                <CircularProgress className={progress} size={20} />
              ) : (
                <Select
                  name='config:dataFields'
                  value={dataFields || []}
                  onChange={updateArr}
                  multiple
                  native
                  inputProps={{ id: 'dataFieldsDropdown' }}
                >
                  {fieldsArr.map(({ name, value = name }, index) => {
                    return (
                      <option key={index} value={value}>
                        {name}
                      </option>
                    );
                  })}
                </Select>
              )}
            </FormControl>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default TextBoxParams;
