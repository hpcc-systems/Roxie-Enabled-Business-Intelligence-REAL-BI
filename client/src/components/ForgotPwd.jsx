import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@material-ui/core';
import { ArrowBackOutlined as ArrowBackOutlinedIcon } from '@material-ui/icons';

// React Components
import Header from './Layout/Header';

// React Hooks
import useForm from '../hooks/useForm';

// Utils
// import { forgotPassword } from '../utils/auth';
import { Alert, AlertTitle } from '@material-ui/lab';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    display: 'block',
    margin: theme.spacing(3, 'auto', 0),
    width: 200,
  },
  closeBtn: {
    color: '#ff5722',
    maxWidth: 20,
    minWidth: 20,
    padding: 0,
  },
  content: { padding: theme.spacing(1, 2) },
  form: {
    maxWidth: '600px',
    margin: '2rem auto 0',
  },

  header: {
    backgroundColor: theme.palette.primary.main,
    color: '#ff5722',
    padding: theme.spacing(1.25, 0, 1.25, 2),
  },

  progress: { marginRight: theme.spacing(2) },

  typography: {
    display: 'inline',
    fontWeight: 'bold',
    marginLeft: theme.spacing(3),
    textTransform: 'uppercase',
  },
}));

const initState = {
  confirmPassword: '',
  error: '',
  errors: [],
  loading: false,
  password: '',
  successMsg: '',
  username: '',
};

const ForgotPwd = () => {
  const { values: localState, formFieldsUpdate } = useForm(initState);
  const history = useHistory();
  const { button, closeBtn, content, form, header, progress, typography } = useStyles();

  const handleSubmit = async event => {
    // Prevent form from reloading page
    event.preventDefault();
    formFieldsUpdate({ loading: true });

    setTimeout(() => {
      formFieldsUpdate({ loading: false, error: ' ' });
    }, 3000);

    // try {
    //   const uuid = await forgotPassword(localState);
    //   history.push(`/reset-password/${uuid}`);
    // } catch (error) {
    // formFieldsUpdate({ loading: false, error:error.message , errors:error?.errors || [] });
    // }
  };

  const { error, errors, loading, username } = localState;
  const usernameErr = errors.find(err => err['username']);

  const warningMessage = 'If you have a user account for Tombolo, this will reset that password too.';

  const alertSeverity = error ? 'error' : 'warning';
  const alertTitle = error ? 'Error' : '';
  const alertMessage = error || warningMessage;

  return (
    <Fragment>
      <Header />
      <Container maxWidth='xl'>
        <form className={form} onSubmit={handleSubmit}>
          <Card>
            <CardHeader
              className={header}
              title={
                <Fragment>
                  <Button className={closeBtn} disabled={loading} onClick={() => history.push('/login')}>
                    <ArrowBackOutlinedIcon fontSize='large' />
                  </Button>
                  <Typography className={typography} variant='h6'>
                    Forgot Password
                  </Typography>
                </Fragment>
              }
            />
            <CardContent className={content}>
              {/* Info Message */}
              <Box my={1}>
                <Alert severity={alertSeverity}>
                  <AlertTitle>{alertTitle}</AlertTitle>
                  {alertMessage}
                  {error && (
                    <>
                      There was an error sending email, please reach out to
                      <Box component='a' display='block' href='mailto: hpcc-solutions-lab@lexisnexisrisk.com'>
                        hpcc-solutions-lab@lexisnexisrisk.com
                      </Box>
                      to have your Password reset
                    </>
                  )}
                </Alert>
              </Box>

              <TextField
                fullWidth
                type='text'
                name='username'
                label='Username'
                value={username}
                error={usernameErr}
                onChange={e => formFieldsUpdate({ username: e.target.value })}
                helperText={usernameErr && usernameErr['username']}
              />

              <Button className={button} variant='contained' type='submit' disabled={loading || !username}>
                {loading && <CircularProgress color='inherit' size={20} className={progress} />}
                Submit
              </Button>
            </CardContent>
          </Card>
        </form>
      </Container>
    </Fragment>
  );
};

export default ForgotPwd;
