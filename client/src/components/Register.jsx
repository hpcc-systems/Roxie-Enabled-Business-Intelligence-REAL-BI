import React, { Fragment } from 'react';
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
import { ArrowBackOutlined as ArrowBackOutlinedIcon } from '@material-ui/icons';
import clsx from 'clsx';

// React Components
import Header from './Layout/Header';

// React Hooks
import useForm from '../hooks/useForm';

// Utils
import { registerUser } from '../utils/auth';

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
    borderRadius: 4,
    color: theme.palette.error.contrastText,
    marginBottom: theme.spacing(1.5),
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
    padding: theme.spacing(0.5, 0),
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
}));

const initState = {
  confirmPassword: '',
  email: '',
  error: '',
  errors: [],
  firstName: '',
  lastName: '',
  loading: false,
  password: '',
  successMsg: '',
  username: '',
};

const fields = [
  { name: 'firstName', label: 'First Name', type: 'text' },
  { name: 'lastName', label: 'Last Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
];

const Register = () => {
  const { values: localState, handleChange } = useForm(initState);
  const history = useHistory();
  const { shareID } = useParams();
  const {
    button,
    closeBtn,
    content,
    errMsg,
    grid,
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

    try {
      const response = await registerUser(localState, shareID);

      handleChange(null, { name: 'loading', value: false });
      handleChange(null, { name: 'errors', value: [] });
      handleChange(null, { name: 'successMsg', value: response.message });

      setTimeout(() => history.push('/login'), 1500); // Wait 1.5 seconds then redirect to login page
    } catch (error) {
      handleChange(null, { name: 'loading', value: false });

      if (error.errors) {
        return handleChange(null, { name: 'errors', value: error.errors });
      } else {
        return handleChange(null, { name: 'error', value: error.message });
      }
    }
  };

  const { error, errors, loading, successMsg } = localState;

  return (
    <Fragment>
      <Header />
      <Container maxWidth='xl'>
        <Grid container direction='column' justifyContent='center' alignItems='center' className={grid}>
          <Grid item style={{ maxWidth: '40vw' }}>
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader
                  className={header}
                  title={
                    <Fragment>
                      <Button className={closeBtn} disabled={loading} onClick={() => history.push('/login')}>
                        <ArrowBackOutlinedIcon fontSize='large' />
                      </Button>
                      <Typography className={typography} variant='h6'>
                        Create Account
                      </Typography>
                    </Fragment>
                  }
                />
                <CardContent className={content}>
                  {/* Error Message */}
                  {error && (
                    <Typography className={errMsg} align='center'>
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

export default Register;
