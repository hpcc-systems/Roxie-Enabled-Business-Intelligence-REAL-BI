import React from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  grid: { marginBottom: theme.spacing(2) },
}));

const PdfEditor = ({ handleChange, localState }) => {
  const { fileName, headerImg, orientation } = localState;
  const { formControl, grid } = useStyles();

  const handleImage = async event => {
    event.persist();
    const reader = new FileReader();
    const file = event.target.files[0];

    try {
      if (file.size > 2048) {
        throw new Error('File size too large!');
      }

      reader.readAsDataURL(file);
      reader.onload = () => {
        handleChange(null, { name: 'headerURI', value: reader.result });
      };
    } catch (error) {
      reader.onerror = err => console.error(err);
      console.error(error);
    }
  };

  return (
    <Grid container spacing={3} className={grid}>
      <Grid item xs={2}>
        <FormControl className={formControl} fullWidth>
          <TextField
            fullWidth
            label='Output File Name'
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
            <MenuItem value='portrait'>Portrait</MenuItem>
            <MenuItem value='landscape'>Landscape</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <FormControl className={formControl} fullWidth>
          <InputLabel>Header Image</InputLabel>
          <Input
            fullWidth
            name='headerImg'
            value={headerImg || ''}
            onChange={event => {
              handleChange(event);
              handleImage(event);
            }}
            type='file'
          />
          <FormHelperText>Maximum file size: 2MB</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs></Grid>
    </Grid>
  );
};

export default PdfEditor;
