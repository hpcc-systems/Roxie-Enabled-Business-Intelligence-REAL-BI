import React, { useEffect } from 'react';

//material module
import { Button, Dialog, TextField, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useSelector } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { getUsers, shareChart } from '../../utils/share';

const useStyles = makeStyles(theme => ({
  button: { backgroundColor: theme.palette.info.main, color: theme.palette.info.contrastText },
  errorMsg: { color: theme.palette.error.main },
}));

const initState = {
  error: '',
  user: '',
  users: [],
};

const validEmailRegex = RegExp(/^[\w.=-]+@[\w-]+\.[\w]{2,3}$/i);

const ShareLinkDialog = ({ show, toggleShare }) => {
  const { id: dashboardID } = useSelector(state => state.dashboard.dashboard);
  const { values: localState, handleChange } = useForm(initState);
  const { button, errorMsg } = useStyles();

  // Get list of available users
  useEffect(() => {
    getUsers().then(data => {
      if (!Array.isArray(data)) {
        return handleChange(null, { name: 'error', value: data });
      } else if (localState.error !== '') {
        handleChange(null, { name: 'error', value: '' });
      }

      handleChange(null, { name: 'users', value: data });
    });
  }, [handleChange, localState.error]);

  const shareDashboard = async email => {
    try {
      shareChart(email, dashboardID);
    } catch (err) {
      console.error(err);
    }

    return toggleShare();
  };

  const handleInputChange = value => {
    // Only attempt to update state if a value is present
    if (value) {
      handleChange(null, { name: 'user', value });
    }
  };

  const handleSubmit = event => {
    const { user } = localState;
    event.preventDefault();

    // Get beginning and end position of email address
    const emailStart = user.indexOf('(') > -1 ? user.indexOf('(') + 1 : 0;
    const emailEnd = user.indexOf(')') > -1 ? user.indexOf(')') : user.length;

    // Get email address
    const email = user
      .substring(emailStart, emailEnd)
      .trim()
      .toLowerCase();

    if (!validEmailRegex.test(email) || user.length === 0) {
      return handleChange(null, { name: 'error', value: 'Email is not valid!' });
    }

    shareDashboard(email);
  };

  const formatDropdownOption = option => {
    const { email, firstName, lastName } = option;

    if (lastName.length === 0) {
      return `${firstName} (${email})`;
    }

    return `${firstName} ${lastName} (${email})`;
  };

  // Destructure localState to get variable references
  const { error, user, users } = localState;

  return (
    <div>
      <form noValidate>
        <Dialog fullWidth open={show}>
          <DialogTitle>Share Link</DialogTitle>
          <DialogContent>
            <Autocomplete
              onInputChange={(event, newValue) => handleInputChange(newValue)}
              options={users}
              freeSolo
              getOptionLabel={option => formatDropdownOption(option)}
              renderInput={params => (
                <TextField
                  required={true}
                  validators={['required', 'isEmail']}
                  {...params}
                  onChange={event => handleInputChange(event.target.value)}
                  autoFocus
                  value={user}
                  label='Email Address'
                  type='email'
                  fullWidth
                />
              )}
            />
            {error.length > 0 && <span className={errorMsg}>{error}</span>}
          </DialogContent>
          <DialogActions>
            <Button color='secondary' onClick={toggleShare}>
              Cancel
            </Button>
            <Button variant='contained' className={button} onClick={handleSubmit}>
              Share
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};
export default ShareLinkDialog;
