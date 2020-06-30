import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
}));

const StaticFileParams = ({ localState, setParamObj }) => {
  const { params = [] } = localState;
  const { formControl } = useStyles();

  // Show only certain params
  const partialParamsArr = params.filter(({ name }) => name === 'Start' || name === 'Count');

  return (
    <Fragment>
      {partialParamsArr.map(({ name, type, value }, index) => {
        return (
          <Grid key={index} item xs={6}>
            <TextField
              label={`${name}: ${type}`}
              name='params'
              value={value || ''}
              onChange={event => setParamObj(event, 'value', name)}
              autoComplete='off'
              className={formControl}
              fullWidth
            />
          </Grid>
        );
      })}
    </Fragment>
  );
};

export default StaticFileParams;
