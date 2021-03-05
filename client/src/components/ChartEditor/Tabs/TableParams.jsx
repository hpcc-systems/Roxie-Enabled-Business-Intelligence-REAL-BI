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
import { TwitterPicker } from 'react-color';

// Utils
import { getConstrastTextColor, getMessage } from '../../../utils/misc';

// Constants
import { messages } from '../../../constants';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2.5, 0, 0, 1),
    minWidth: 30,
    padding: 0,
  },
  colorDiv: {
    margin: '0 auto',
    marginTop: theme.spacing(1.75),
    width: 30,
    height: 30,
    borderRadius: '50%',
  },
  grid: { marginTop: theme.spacing(2) },
  progress: { margin: 0, marginTop: 50 },
}));

const TableParams = ({ eclRef, handleChangeObj, localState }) => {
  const { schema = [] } = eclRef.current;
  const { chartID, configuration, selectedDataset = {}, sourceType } = localState;
  const { fields = [] } = selectedDataset;
  const { fields: configFields = [] } = configuration;
  const { button, colorDiv, grid, progress } = useStyles();

  const updateField = (event, index) => {
    const { name, value } = event.target;
    const newFieldsArr = new Array(...configFields);

    // Update index
    if (name === 'color') {
      newFieldsArr[index] = { ...newFieldsArr[index], [name]: value, text: getConstrastTextColor(value) };
    } else {
      newFieldsArr[index] = { ...newFieldsArr[index], [name]: value };
    }

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
      newFieldsArr.push({ color: '#FFF', label: '', name: '' });
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
        <Grid container spacing={2}>
          {configFields.map(({ color, label, name }, index) => {
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
                <Grid item xs={3}>
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
                <Grid item xs={isPopulated ? 3 : 4}>
                  <TextField
                    fullWidth
                    label='Label'
                    name='label'
                    value={label || ''}
                    onChange={event => updateField(event, index)}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={1}>
                  <div className={colorDiv} style={{ backgroundColor: color }} />
                </Grid>
                <Grid item xs={4}>
                  <TwitterPicker
                    colors={[]}
                    color={color || '#FFF'}
                    triangle='hide'
                    onChangeComplete={color =>
                      updateField({ target: { name: 'color', value: color.hex } }, index)
                    }
                    width='100%'
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
