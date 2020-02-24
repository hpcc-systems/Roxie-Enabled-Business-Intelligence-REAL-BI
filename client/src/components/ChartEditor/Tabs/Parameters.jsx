import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formControl: { margin: `${theme.spacing(1)}px 0` },
  typography: { marginTop: 12 },
}));

const ParametersTab = ({ handleChangeObj, localState }) => {
  const { dataset, datasetObj, params } = localState;
  const { params: paramsData = [] } = datasetObj;
  const { formControl, typography } = useStyles();

  return (
    <FormControl className={formControl} fullWidth>
      {dataset ? (
        paramsData.length > 0 ? (
          <Fragment>
            {paramsData.map(({ name, type }, index) => {
              return (
                <TextField
                  key={index}
                  label={`${name}: ${type}`}
                  name={`params:${name}`}
                  // Ternary is here to prevent error of input switching from uncontrolled to controlled
                  value={params[name] === undefined ? '' : params[name]}
                  onChange={handleChangeObj}
                  autoComplete="off"
                  className={formControl}
                />
              );
            })}
          </Fragment>
        ) : (
          <Typography variant="h6" color="inherit" align="center" className={typography}>
            No Parameters
          </Typography>
        )
      ) : (
        <Typography variant="h6" color="inherit" align="center" className={typography}>
          Choose a dataset
        </Typography>
      )}
    </FormControl>
  );
};

export default ParametersTab;
