import React, { Fragment } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
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

// React Components
import Header from './Layout/Header';

// React Hooks
import useForm from '../hooks/useForm';

// Utils
import { registerUser } from '../utils/auth';
import { Alert, AlertTitle } from '@material-ui/lab';

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
  grid: { marginTop: '2rem' },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: '#ff5722',
    padding: theme.spacing(1.25, 0, 1.25, 2),
  },
  progress: { marginRight: theme.spacing(2) },
  textfield: {
    margin: theme.spacing(1, 0),
    [theme.breakpoints.down('md')]: {
      margin: 0,
    },
  },
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
  const { values: localState, handleChange, formFieldsUpdate } = useForm(initState);
  const history = useHistory();
  const { shareID } = useParams();
  const { button, closeBtn, content, grid, header, progress, textfield, typography } = useStyles();

  const handleSubmit = async event => {
    // Prevent form from reloading page
    event.preventDefault();

    formFieldsUpdate({ loading: false });

    try {
      const response = await registerUser(localState, shareID);
      console.log(`response`, response);
      formFieldsUpdate({ loading: false, errors: [], successMsg: response.message });
      setTimeout(() => history.push('/login'), 1500); // Wait 1.5 seconds then redirect to login page
    } catch (error) {
      formFieldsUpdate({ loading: false, errors: error.errors || [], error: error.message });
    }
  };

  const { error, errors, loading, successMsg } = localState;

  const alertMessage = error || successMsg;
  const alertSeverity = error ? 'error' : 'success';
  const alertTitle = error ? 'Error' : 'Success';

  return (
    <Fragment>
      <Header />
      <Container maxWidth='xl'>
        <Grid container direction='column' justifyContent='center' alignItems='center' className={grid}>
          <Grid item style={{ maxWidth: '600px' }}>
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
                  {/* Info Message */}
                  {alertMessage && (
                    <Box my={1}>
                      <Alert severity={alertSeverity}>
                        <AlertTitle>{alertTitle}</AlertTitle>
                        {alertMessage}
                      </Alert>
                    </Box>
                  )}

                  <Grid container spacing={1}>
                    {fields.map(({ label, name, type }, index) => {
                      const err = errors.find(err => err[name]);

                      return (
                        <Grid key={index} item xs={12} sm={6}>
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
