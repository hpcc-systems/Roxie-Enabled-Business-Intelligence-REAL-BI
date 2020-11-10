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
import { forgotPassword } from '../utils/auth';

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
  errMsg: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },
  form: {
    minWidth: '36vw',
    maxWidth: '36vw',
  },
  grid: { margin: '2rem' },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: '#ff5722',
    padding: theme.spacing(1.25, 0, 1.25, 2),
  },
  message: {
    borderRadius: 4,
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(0.5),
  },
  progress: { marginRight: theme.spacing(2) },
  success: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  textfield: { margin: theme.spacing(1, 0) },
  typography: {
    display: 'inline',
    fontWeight: 'bold',
    marginLeft: theme.spacing(3),
    textTransform: 'uppercase',
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
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
  const { values: localState, handleChange } = useForm(initState);
  const history = useHistory();
  const {
    button,
    closeBtn,
    content,
    errMsg,
    form,
    grid,
    header,
    message,
    progress,
    success,
    textfield,
    typography,
    warning,
  } = useStyles();

  const handleSubmit = async event => {
    // Prevent form from reloading page
    event.preventDefault();

    handleChange(null, { name: 'loading', value: true });

    try {
      const uuid = await forgotPassword(localState);
      history.push(`/reset-password/${uuid}`);
    } catch (error) {
      handleChange(null, { name: 'loading', value: false });

      if (Array.isArray(error.errors)) {
        return handleChange(null, { name: 'errors', value: error.errors });
      } else {
        return handleChange(null, { name: 'error', value: error.message });
      }
    }
  };

  const { error, errors, loading, successMsg, username } = localState;
  const usernameErr = errors.find(err => err['username']);

  return (
    <Fragment>
      <Header />
      <Container maxWidth='xl'>
        <Grid container direction='column' justify='center' alignItems='center' className={grid}>
          <Grid item>
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
                  {/* Error Message */}
                  {error && (
                    <Typography className={classnames(message, errMsg)} align='center'>
                      {error}
                    </Typography>
                  )}
                  {/* Success Message */}
                  {successMsg && successMsg !== '' && (
                    <Typography className={classnames(message, success)} align='center'>
                      {successMsg}
                    </Typography>
                  )}
                  {/* Warning Message */}
                  {errors.length === 0 && successMsg === '' && (
                    <Typography variant='body2' className={classnames(message, warning)} align='center'>
                      If you have a user account for Tombolo, this will reset that password too.
                    </Typography>
                  )}

                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        className={textfield}
                        label='Username'
                        name='username'
                        value={username}
                        type={'text'}
                        onChange={handleChange}
                        fullWidth
                        error={usernameErr !== undefined}
                        helperText={usernameErr !== undefined ? usernameErr['username'] : ''}
                      />
                    </Grid>
                  </Grid>
                  <Grid container direction='row' justify='center' alignItems='center' spacing={0}>
                    <Grid item>
                      <Button
                        className={button}
                        variant='contained'
                        type='submit'
                        disabled={loading || successMsg !== ''}
                      >
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

export default ForgotPwd;
