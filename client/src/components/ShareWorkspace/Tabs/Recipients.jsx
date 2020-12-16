import React, { Fragment } from 'react';
import { TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Create styles
const useStyles = makeStyles(theme => ({
  dialogText: { fontSize: '0.85rem', marginTop: theme.spacing(1.5) },
  formControl: { margin: theme.spacing(1.5, 0) },
}));

const ShareRecipients = ({ handleChange, localState }) => {
  const { dialogText, formControl } = useStyles();

  const { errors, email } = localState;
  const emailErr = errors.find(err => Object.keys(err)[0].includes('email'));

  return (
    <Fragment>
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
      <Typography className={dialogText}>
        Recipient(s) must have access to the corresponding cluster and data in order to view the shared
        dashboard(s).
      </Typography>
    </Fragment>
  );
};

export default ShareRecipients;
