import React, { Fragment, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
import clsx from 'clsx';

// React Components
import Header from './Layout/Header';

// React Hooks
import useForm from '../hooks/useForm';

// Utils
import { resetPassword } from '../utils/auth';

// Create styles
const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    marginTop: theme.spacing(3),
    width: 200,
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
};

const fields = [
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
];

const ResetPwd = () => {
  const { values: localState, handleChange } = useForm(initState);
  const history = useHistory();
  const { resetUUID } = useParams();
  const {
    button,
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
  } = useStyles();

  useEffect(() => {
    if (!resetUUID) {
      history.push('/login');
    }
  }, [history, resetUUID]);

  const handleSubmit = async event => {
    // Prevent form from reloading page
    event.preventDefault();

    handleChange(null, { name: 'loading', value: true });

    try {
      await resetPassword({ ...localState, id: resetUUID });
    } catch (error) {
      handleChange(null, { name: 'loading', value: false });

      if (error.errors) {
        return handleChange(null, { name: 'errors', value: error.errors });
      } else {
        return handleChange(null, { name: 'error', value: error.message });
      }
    }

    handleChange(null, { name: 'loading', value: false });
    handleChange(null, { name: 'errors', value: [] });
    handleChange(null, { name: 'error', value: '' });
    handleChange(null, { name: 'successMsg', value: 'Password Reset' });

    setTimeout(() => history.push('/login'), 1500); // Wait 1.5 seconds then redirect to login page
  };

  const { error, errors, loading, successMsg } = localState;

  return (
    <Fragment>
      <Header />
      <Container maxWidth='xl'>
        <Grid container direction='column' justifyContent='center' alignItems='center' className={grid}>
          <Grid item>
            <form className={form} onSubmit={handleSubmit}>
              <Card>
                <CardHeader
                  className={header}
                  title={
                    <Fragment>
                      <Typography className={typography} variant='h6'>
                        Reset Password
                      </Typography>
                    </Fragment>
                  }
                />
                <CardContent className={content}>
                  {/* Error Message */}
                  {error && (
                    <Typography className={clsx(message, errMsg)} align='center'>
                      {error}
                    </Typography>
                  )}
                  {/* Success Message */}
                  {successMsg && successMsg !== '' && (
                    <Typography className={clsx(message, success)} align='center'>
                      {successMsg}
                    </Typography>
                  )}

                  <Grid container spacing={1}>
                    {fields.map(({ label, name, type }, index) => {
                      const err = errors.find(err => err[name]);

                      return (
                        <Grid key={index} item xs={6}>
                          <TextField
                            className={textfield}
                            label={label}
                            name={name}
                            value={localState[name]}
                            type={type}
                            onChange={handleChange}
                            fullWidth
                            error={err !== undefined}
                            helperText={err !== undefined ? err[name] : ''}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Grid container direction='row' justifyContent='center' alignItems='center' spacing={0}>
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

export default ResetPwd;
