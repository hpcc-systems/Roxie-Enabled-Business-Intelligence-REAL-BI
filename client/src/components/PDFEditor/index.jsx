import React from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  grid: { marginBottom: theme.spacing(2) },
}));

const PdfEditor = ({ handleChange, localState }) => {
  const { fileName, orientation } = localState;
  const { formControl, grid } = useStyles();

  return (
    <Grid container spacing={3} className={grid}>
      <Grid item xs={2}>
        <FormControl className={formControl} fullWidth>
          <TextField
            fullWidth
            label='File Name'
            name='fileName'
            value={fileName}
            onChange={handleChange}
            autoComplete='off'
          />
        </FormControl>
      </Grid>
      <Grid item xs={2}>
        <FormControl className={formControl} fullWidth>
          <InputLabel>Orientation</InputLabel>
          <Select name='orientation' value={orientation} onChange={handleChange}>
            <MenuItem value={'portrait'}>Portrait</MenuItem>
            <MenuItem value={'landscape'}>Landscape</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={8}></Grid>
    </Grid>
  );
};

export default PdfEditor;
