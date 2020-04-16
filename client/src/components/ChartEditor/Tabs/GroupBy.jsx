import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0`, marginTop: 25 },
  progress: { margin: 0, marginTop: 50 },
  typography: { marginTop: 20 },
}));

const GroupByTab = ({ handleChange, localState }) => {
  const { chartID, dataset, groupBy, selectedDataset } = localState;
  const { fields = [{ name: 'Choose a dataset', value: '' }] } = selectedDataset;
  const { formControl, progress, typography } = useStyles();

  return dataset ? (
    <FormControl className={formControl} fullWidth>
      <InputLabel>Group Field</InputLabel>
      {chartID && fields.length <= 1 ? (
        <CircularProgress className={progress} size={20} />
      ) : (
        <Select name='groupBy' value={groupBy || ''} onChange={handleChange}>
          {groupBy !== '' && <MenuItem value={''}>Clear Selection</MenuItem>}
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
  ) : (
    <Typography variant='h6' color='inherit' align='center' className={typography}>
      Choose a dataset
    </Typography>
  );
};

export default GroupByTab;
