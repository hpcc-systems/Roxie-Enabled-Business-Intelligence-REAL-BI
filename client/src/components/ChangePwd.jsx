import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { ArrowBackOutlined as ArrowBackOutlinedIcon } from '@material-ui/icons';
import classnames from 'classnames';

// React Components
import Header from './Layout/Header';

// React Hooks
import useForm from '../hooks/useForm';

// Utils
import { updatePassword } from '../utils/auth';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    marginTop: theme.spacing(3),
    width: 200,
  },
  closeBtn: {
    color: '#ff5722',
    maxWidth: 20,
    minWidth: 20,
    padding: 0,
  },
  content: { padding: theme.spacing(1, 2) },
  err: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: '#ff5722',
    padding: theme.spacing(1.25, 0, 1.25, 2),
  },
  message: {
    borderRadius: 4,
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(0.5, 0),
  },
  progress: { marginRight: theme.spacing(2) },
  success: {
    backgroundColor: theme.palette.success.dark,
    color: theme.palette.success.contrastText,
  },
  textfield: { margin: theme.spacing(1, 0) },
  typography: {
    display: 'inline',
    fontWeight: 'bold',
    marginLeft: theme.spacing(3),
    textTransform: 'uppercase',
  },
}));

const initState = {
  errorMsg: '',
  loading: false,
  newPwd: '',
  newPwd2: '',
  oldPwd: '',
  successMsg: '',
};

const ChangePwd = () => {
  const { values: localState, handleChange, resetState } = useForm(initState);
  const history = useHistory();
  const {
    button,
    closeBtn,
    content,
    err,
    header,
    message,
    progress,
    success,
    textfield,
    typography,
  } = useStyles();

  const handleSubmit = async event => {
    // Prevent form from reloading page
    event.preventDefault();

    handleChange(null, { name: 'loading', value: true });

    let response;

    try {
      response = await updatePassword(localState);
    } catch (err) {
      resetState(initState);
      return handleChange(null, { name: 'errorMsg', value: err });
    }

    resetState(initState);
    return handleChange(null, { name: 'successMsg', value: response });
  };

  const { errorMsg, loading, oldPwd, newPwd, newPwd2, successMsg } = localState;

  return (
    <Fragment>
      <Header />
      <Container maxWidth='xl'>
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
          spacing={0}
          style={{ minHeight: '50vh' }}
        >
          <Grid item style={{ maxWidth: '25vw' }}>
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader
                  className={header}
                  title={
                    <Fragment>
                      <Button className={closeBtn} disabled={loading} onClick={() => history.goBack()}>
                        <ArrowBackOutlinedIcon fontSize='large' />
                      </Button>
                      <Typography className={typography} variant='h6'>
                        Change Password
                      </Typography>
                    </Fragment>
                  }
                />
                <CardContent className={content}>
                  {/* Error message */}
                  {errorMsg && errorMsg !== '' && (
                    <Typography className={classnames(message, err)} align='center'>
                      {errorMsg}
                    </Typography>
                  )}

                  {/* Success Message */}
                  {successMsg && successMsg !== '' && (
                    <Typography className={classnames(message, success)} align='center'>
                      {successMsg}
                    </Typography>
                  )}

                  <TextField
                    className={textfield}
                    label='Old Password'
                    name='oldPwd'
                    value={oldPwd}
                    type='password'
                    onChange={handleChange}
                    autoComplete='false'
                    fullWidth
                  />
                  <TextField
                    className={textfield}
                    label='New Password'
                    name='newPwd'
                    value={newPwd}
                    type='password'
                    onChange={handleChange}
                    autoComplete='false'
                    fullWidth
                  />
                  <TextField
                    className={textfield}
                    label='Confirm New Password'
                    name='newPwd2'
                    value={newPwd2}
                    type='password'
                    onChange={handleChange}
                    autoComplete='false'
                    fullWidth
                  />
                  <Grid container direction='row' justify='center' alignItems='center' spacing={0}>
                    <Grid item>
                      <Button className={button} variant='contained' type='submit' disabled={loading}>
                        {loading && <CircularProgress color='inherit' size={20} className={progress} />}
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default ChangePwd;
