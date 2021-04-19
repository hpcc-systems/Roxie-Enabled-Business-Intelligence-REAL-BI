import React, { Fragment } from 'react';
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { Remove as RemoveIcon } from '@material-ui/icons';
import ConfigOptions from '../AxisConfig/ConfigOptions';
import { getMessage } from '../../../utils/misc';
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

const MapParams = props => {
  const { eclRef, handleChangeObj, localState } = props;
  const { schema = [] } = eclRef.current;
  const { chartID, configuration, selectedDataset = {}, sourceType } = localState;
  const { fields = [] } = selectedDataset;
  const { mapFields = [] } = configuration;
  const { button, grid, progress } = useStyles();

  const updateField = (event, index) => {
    const { name, value } = event.target;
    const newFieldsArr = new Array(...mapFields);

    // Update index
    newFieldsArr[index] = { ...newFieldsArr[index], [name]: value };

    // Add new object to end of array for next entry
    if (newFieldsArr.length - 1 === index) {
      newFieldsArr.push({ label: '', name: '' });
    }

    return handleChangeObj(null, { name: 'configuration:mapFields', value: newFieldsArr });
  };

  const removeParam = index => {
    const newFieldsArr = new Array(...mapFields);

    newFieldsArr.splice(index, 1);

    // Array is empty, add an empty object
    if (newFieldsArr.length === 0) {
      newFieldsArr.push({ label: '', name: '' });
    }

    return handleChangeObj(null, { name: 'configuration:mapFields', value: newFieldsArr });
  };

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  return (
    <Fragment>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <ConfigOptions
            {...props}
            field='axis2'
            label='Latitude'
            showDataTypeOption={false}
            showAxisLabelOption={false}
            showLabelOption={false}
          />
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          <ConfigOptions
            {...props}
            field='axis1'
            label='Longitude'
            showDataTypeOption={false}
            showAxisLabelOption={false}
            showLabelOption={false}
          />
        </Grid>
      </Grid>

      <h3 style={{ marginBottom: 0 }}>Popup Config</h3>
      <Grid item md={12} className={grid}>
        {chartID && messages.indexOf(fieldsArr[0].name) > -1 ? (
          <CircularProgress className={progress} size={20} />
        ) : (
          <Grid container spacing={2}>
            {mapFields.map(({ label, name }, index) => {
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
                  <Grid item xs={6}>
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
                  <Grid item xs={isPopulated ? 5 : 6}>
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
    </Fragment>
  );
};

export default MapParams;
