import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

import LinkCheckBox from './LinkCheckbox';
import ColorPicker from './ColorPicker';

// Utils
import { getConstrastTextColor, getMessage } from '../../../../utils/misc';

// Constants
import { messages } from '../../../../constants';

const useStyles = makeStyles(theme => ({
  buttonBox: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiButton-root': {
      minWidth: 0,
    },
  },
  colorPicker: {
    height: '40px',
  },

  grid: { marginTop: theme.spacing(2) },
}));

const TableParams = ({ eclRef, handleChangeObj, localState }) => {
  const { schema = [] } = eclRef.current;
  const { configuration, selectedDataset = {}, sourceType } = localState;
  const { fields = [] } = selectedDataset;
  const { fields: configFields = [] } = configuration;
  const { buttonBox, grid } = useStyles();

  const updateField = (event, index) => {
    const { name, value } = event.target;
    const newFieldsArr = new Array(...configFields);

    // Update index
    if (name === 'asLink') {
      newFieldsArr[index] = { ...newFieldsArr[index], [name]: event.target.checked };
      if (!event.target.checked) newFieldsArr[index].linkBase = '';
    } else if (name === 'color') {
      newFieldsArr[index] = { ...newFieldsArr[index], [name]: value, text: getConstrastTextColor(value) };
    } else {
      newFieldsArr[index] = { ...newFieldsArr[index], [name]: value };
    }
    // Add new object to end of array for next entry
    if (newFieldsArr.length - 1 === index) {
      newFieldsArr.push({ color: '#ffff', label: '', name: '', asLink: false, linkBase: '' });
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

  const fieldsArr = schema.length > 0 ? schema : fields.length > 0 ? fields : [];
  return (
    <Grid item xs={12} className={grid}>
      <Fragment>
        {configFields.map(({ color, label, name, asLink, linkBase }, index) => {
          const isPopulated = name !== '' && !messages.includes(name);
          return (
            <Box component={'div'} key={index}>
              <Grid container spacing={1} justifyContent='space-between' alignItems='flex-end'>
                <Grid item xs={1} className={buttonBox}>
                  {isPopulated && (
                    <Button onClick={() => removeParam(index)}>
                      <ClearIcon />
                    </Button>
                  )}
                </Grid>

                <Grid item xs={4}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Field</InputLabel>
                    <Select name='name' value={name || ''} onChange={event => updateField(event, index)}>
                      {fieldsArr.length === 0 && <MenuItem value=''>{getMessage(sourceType)}</MenuItem>}
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

                <Grid item xs={5} lg={3}>
                  <TextField
                    size='small'
                    fullWidth
                    label='Label'
                    name='label'
                    value={label || ''}
                    onChange={event => updateField(event, index)}
                    autoComplete='off'
                  />
                </Grid>

                <Grid item xs={2} md={1}>
                  <ColorPicker color={color} updateField={updateField} index={index} />
                </Grid>

                <Grid item xs={12} lg={3}>
                  <LinkCheckBox
                    disabled={!isPopulated} // disable checkbox if 'select' is not choosen
                    value={asLink}
                    updateField={updateField}
                    index={index}
                  />
                </Grid>

                {asLink && (
                  <Grid item xs={12}>
                    <TextField
                      placeholder='https://'
                      size='small'
                      fullWidth
                      label='Link base'
                      name='linkBase'
                      helperText='use ${Field} in address to form a link. Example: https://webpage.com/${Field}/risk'
                      value={linkBase || ''}
                      onChange={event => updateField(event, index)}
                      autoComplete='off'
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          );
        })}
      </Fragment>
    </Grid>
  );
};

export default TableParams;
