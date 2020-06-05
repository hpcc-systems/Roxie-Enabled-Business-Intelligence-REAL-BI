import React from 'react';

//material module
import { Button, Dialog, TextField, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { useSelector } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';

// Utils
import { shareChart } from '../../utils/share';

const ShareLinkDialog = ({ show, toggleShare }) => {
  const { dashboard } = useSelector(state => state.dashboard);
  const { id: dashboardID } = dashboard;
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  let userSuggestions = [];

  const shareDashboard = async () => {
    try {
      shareChart(email, dashboardID);
    } catch (err) {
      console.error(err);
    }
    return toggleShare();
  };

  // const handleInputChange = (event,value) => {
  //   getUsers().then((res) => {
  //     for (const result of res.data){
  //         if(!userSuggestions.includes(result.login))
  //         {
  //           userSuggestions.push(result.login);
  //         }
  //     }
  //   });
  // }
  const validEmailRegex = RegExp(/^[\w=-]+@[\w-]+\.[\w]{2,3}$/i);

  const handleEmailChange = event => {
    event.preventDefault();
    const { value } = event.target;
    setError(validEmailRegex.test(value) ? '' : 'Email is not valid!');
    setEmail(value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (error || email.length === 0) {
      setError('Email is not valid!');
    } else {
      shareDashboard();
    }
  };

  return (
    <div>
      <form noValidate>
        <Dialog fullWidth open={show}>
          <DialogTitle id=''>Share Link</DialogTitle>
          <DialogContent>
            <Autocomplete
              //onInputChange={handleInputChange}
              options={userSuggestions}
              freeSolo
              getOptionLabel={option => option}
              renderInput={params => (
                <TextField
                  required={true}
                  validators={['required', 'isEmail']}
                  {...params}
                  onChange={handleEmailChange}
                  autoFocus
                  value={email}
                  label='Email Address'
                  type='email'
                  fullWidth
                />
              )}
            />
            {error.length > 0 && <span className='error'>{error}</span>}
          </DialogContent>
          <DialogActions>
            <Button color='secondary' onClick={toggleShare}>
              Cancel
            </Button>
            <Button variant='contained' color='primary' onClick={handleSubmit}>
              Share
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};
export default ShareLinkDialog;
