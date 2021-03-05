import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { Remove as RemoveIcon } from '@material-ui/icons';

// Utils
import { getMessage } from '../../../utils/misc';

// Constants
import { messages } from '../../../constants';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2.5, 0, 0, 1),
    minWidth: 30,
    padding: 0,
  },
  grid: { marginTop: theme.spacing(2) },
  progress: { margin: 0, marginTop: 50 },
}));

const TableParams = ({ eclRef, handleChangeObj, localState }) => {
  const { schema = [] } = eclRef.current;
  const { chartID, configuration, selectedDataset = {}, sourceType } = localState;
  const { fields = [] } = selectedDataset;
  const { fields: configFields = [] } = configuration;
  const { button, grid, progress } = useStyles();

  const updateField = (event, index) => {
    const { name, value } = event.target;
    const newFieldsArr = new Array(...configFields);

    // Update index
    newFieldsArr[index] = { ...newFieldsArr[index], [name]: value };

    // Add new object to end of array for next entry
    if (newFieldsArr.length - 1 === index) {
      newFieldsArr.push({ label: '', name: '' });
    }

    return handleChangeObj(null, { name: 'configuration:fields', value: newFieldsArr });
  };

  const removeParam = index => {
    const newFieldsArr = new Array(...configFields);

    newFieldsArr.splice(index, 1);

    // Array is empty, add an empty object
    if (newFieldsArr.length === 0) {
      newFieldsArr.push('');
    }

    return handleChangeObj(null, { name: 'configuration:fields', value: newFieldsArr });
  };

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  return (
    <Grid item md={12} className={grid}>
      {chartID && messages.indexOf(fieldsArr[0].name) > -1 ? (
        <CircularProgress className={progress} size={20} />
      ) : (
        <Grid container spacing={1}>
          {configFields.map(({ label, name }, index) => {
            const isPopulated = Boolean(name);
            return (
              <Fragment key={index}>
                {isPopulated && (
                  <Grid item xs={1}>
                    <Button className={button} onClick={() => removeParam(index)}>
                      <RemoveIcon />
                    </Button>
                  </Grid>
                )}
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <InputLabel>Field</InputLabel>
                    <Select name='name' value={name || ''} onChange={event => updateField(event, index)}>
                      {fieldsArr.map(({ name }, index) => {
                        return (
                          <MenuItem key={index} value={name}>
                            {name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={isPopulated ? 6 : 7}>
                  <TextField
                    fullWidth
                    label='Label'
                    name='label'
                    value={label || ''}
                    onChange={event => updateField(event, index)}
                    autoComplete='off'
                  />
                </Grid>
              </Fragment>
            );
          })}
        </Grid>
      )}
    </Grid>
  );
};

export default TableParams;
