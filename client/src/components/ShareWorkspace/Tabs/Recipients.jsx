import React, { Fragment } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

// Create styles
const useStyles = makeStyles(theme => ({
  formControl: { margin: theme.spacing(1.5, 0) },
}));

const ShareRecipients = ({ handleChange, localState }) => {
  const { formControl } = useStyles();

  const { errors, email } = localState;
  const emailErr = errors.find(err => Object.keys(err)[0].includes('email'));

  return (
    <Fragment>
      <Alert severity='info'>Users must have access to cluster to see dashboards.</Alert>

      <TextField
        className={formControl}
        fullWidth
        label='Recipient Email Address'
        name='email'
        value={email}
        onChange={handleChange}
        error={emailErr !== undefined}
        helperText={
          emailErr !== undefined
            ? [Object.values(emailErr)]
            : 'Separate email addresses with a semi-colon ( ; ).'
        }
      />
    </Fragment>
  );
};

export default ShareRecipients;
