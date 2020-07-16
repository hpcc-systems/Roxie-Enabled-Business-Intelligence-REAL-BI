import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
}));

const TextBoxParams = ({ handleChangeObj, localState }) => {
  const { options } = localState;
  const { formControl } = useStyles();

  return (
    <Grid item md={12}>
      <FormControl className={formControl} fullWidth>
        <TextField
          fullWidth
          label='TextBox'
          multiline
          name='options:textBoxContent'
          value={options.textBoxContent || ''}
          rows={8}
          onChange={handleChangeObj}
          autoComplete='off'
        />
      </FormControl>
    </Grid>
  );
};

export default TextBoxParams;
