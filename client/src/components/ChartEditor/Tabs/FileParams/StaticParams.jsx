import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Tooltip } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
}));

const StaticFileParams = ({ localState, setParamObj }) => {
  const { params = [] } = localState.config;
  const { formControl } = useStyles();

  // Show only certain params
  const startParam = params.filter(({ name }) => name === 'Start');
  const countParam = params.filter(({ name }) => name === 'Count');
  const startTooltip = 'The number of the row you wish to begin your dataset. Defaults to the first row (1).';
  const countTooltip =
    'The number of rows you wish to return from your dataset. Defaults to complete dataset for queries and 5,000 rows for files and ecl scripts.';

  return (
    <Fragment>
      <Grid item xs={6}>
        <Tooltip title={startTooltip} placement='right'>
          <TextField
            label='Starting Row'
            value={startParam.value || ''}
            onChange={event => setParamObj(event, 'Start')}
            autoComplete='off'
            className={formControl}
            fullWidth
          />
        </Tooltip>
      </Grid>
      <Grid item xs={6}>
        <Tooltip title={countTooltip} placement='right'>
          <TextField
            label='Number of Rows'
            value={countParam.value || ''}
            onChange={event => setParamObj(event, 'Count')}
            autoComplete='off'
            className={formControl}
            fullWidth
          />
        </Tooltip>
      </Grid>
    </Fragment>
  );
};

export default StaticFileParams;
