import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  Grid,
  TextField,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
}));

// Changes message based on source type
const getMsg = sourceType => {
  return sourceType === 'file' ? 'Choose a file' : 'Choose a dataset';
};

const TextBoxParams = ({ handleChangeObj, localState }) => {
  const { chartID, options, selectedDataset = {}, sourceType } = localState;
  const { isStatic } = options;
  const { fields = [{ name: getMsg(sourceType), value: '' }] } = selectedDataset;
  const { formControl, progress } = useStyles();

  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <Grid item md={8}>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='TextBox'
              multiline
              name='options:textBoxContent'
              value={options.textBoxContent || ''}
              rows={4}
              onChange={handleChangeObj}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
        {!isStatic && (
          <Grid item md={4}>
            <FormControl className={formControl} fullWidth>
              <InputLabel>Data Fields</InputLabel>
              {chartID && fields.length <= 1 ? (
                <CircularProgress className={progress} size={20} />
              ) : (
                <Select name='options:dataFields' value={options.dataFields || ''} onChange={handleChangeObj}>
                  {fields.map(({ name, value = name }, index) => {
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
        )}
      </Grid>
    </Grid>
  );
};

export default TextBoxParams;
