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
      <Grid container spacing={2}>
        <Grid item md={8}>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='TextBox'
              multiline
              name='options:TextBox'
              value={options.TextBox || ''}
              rows={8}
              variant='outlined'
              onChange={handleChangeObj}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TextBoxParams;
