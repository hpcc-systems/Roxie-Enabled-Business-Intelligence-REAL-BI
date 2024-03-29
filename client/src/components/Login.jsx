import React, { useState, Fragment, useCallback } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Link,
  TextField,
} from '@material-ui/core';

// React Components
import Header from './Layout/Header';

// Redux Actions
import { getLatestUserData, loginUser } from '../features/auth/actions';
import { getWorkspaces } from '../features/workspace/actions';

// React Hooks
import useForm from '../hooks/useForm';

// Utils
import { checkForToken } from '../utils/auth';
import setAuthHeader from '../utils/axiosConfig';

// Constants
import { tokenName } from '../constants';
import { useEffect } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  actions: { backgroundColor: theme.palette.secondary.light },
  button: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    margin: theme.spacing(3, 0, 1.5, 0),
    width: 200,
  },
  content: { padding: theme.spacing(1, 2) },
  grid: { marginTop: '2rem' },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: '#ff5722',
    padding: theme.spacing(1.25, 0, 1.25, 2),
    '& span': {
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
  },
  options: {
    color: theme.palette.secondary.contrastText,
    cursor: 'pointer',
    padding: theme.spacing(1, 1.25),
  },
  progress: { marginRight: theme.spacing(2) },
  textfield: { margin: theme.spacing(1, 0) },
}));

const initState = {
  username: '',
  password: '',
  loading: false,
};

const Login = () => {
  const { values: localState, handleChange } = useForm(initState);
  const { loading, password, username } = localState;
  const { errorObj } = useSelector(state => state.auth);
  const { errors = [], message: errMessage = '' } = errorObj;
  const dispatch = useDispatch();
  const history = useHistory();
  const { actions, button, content, grid, header, options, progress, textfield } = useStyles();
  const hasAuthError = Object.keys(errorObj).length > 0;
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const { token, valid } = checkForToken();
    if (token) {
      if (valid && !hasAuthError) {
        // There is a valid token in storage
        setAuthHeader(token);
        getUserData();
      } else {
        setIsInitializing(() => false);
        // There is an invalid token in storage
        localStorage.removeItem(tokenName);
        setAuthHeader();
      }
    } else {
      setIsInitializing(() => false);
    }
    return () => setIsInitializing(() => false);
  }, []);

  const loginUserFn = async event => {
    event.preventDefault();
    handleChange(null, { name: 'loading', value: true });

    try {
      const { action, token } = await loginUser(localState);

      // Set local storage and auth header
      localStorage.setItem(tokenName, token);
      setAuthHeader(token);
      dispatch(action);
      getUserData();
    } catch (error) {
      handleChange(null, { name: 'loading', value: false });
      dispatch(error);
    }
  };

  const getUserData = useCallback(async () => {
    (async () => {
      try {
        const { action, lastViewedWorkspace } = await getLatestUserData();
        const action2 = await getWorkspaces();

        // Send data to redux store
        batch(() => {
          dispatch(action);
          dispatch(action2);

          // Generate new url and navigate there
          const redirectedFrom = history.location?.state?.from;
          let location = lastViewedWorkspace ? `/workspace/${lastViewedWorkspace}` : '/workspace';
          history.push(redirectedFrom || location);
        });
      } catch (error) {
        dispatch(error);
        handleChange(null, { name: 'loading', value: false });
        setIsInitializing(() => false);
      }
    })();
  }, []);
  const usernameErr = errors.find(err => err['username']);
  const passwordErr = errors.find(err => err['password']);

  return (
    <Fragment>
      <Header />
      <Container maxWidth='xl'>
        <Grid
          container
          direction='column'
          justifyContent='center'
          alignItems='center'
          className={grid}
          spacing={0}
        >
          <Grid item>
            {isInitializing ? (
              <CircularProgress />
            ) : (
              <form onSubmit={loginUserFn}>
                <Card>
                  <CardHeader className={header} title='Login' />
                  <CardContent className={content}>
                    {errMessage && (
                      <Box my={1}>
                        <Alert severity='error'>
                          <AlertTitle>Error</AlertTitle>
                          {/* {errMessage} */}
                          Invalid user credentials. Please check your Username and Password.
                        </Alert>
                      </Box>
                    )}
                    <TextField
                      className={textfield}
                      label='Username'
                      name='username'
                      value={username}
                      onChange={handleChange}
                      fullWidth
                      error={usernameErr !== undefined}
                      helperText={usernameErr !== undefined ? usernameErr['username'] : ''}
                    />
                    <TextField
                      className={textfield}
                      label='Password'
                      name='password'
                      type='password'
                      value={password}
                      onChange={handleChange}
                      autoComplete='false'
                      fullWidth
                      error={passwordErr !== undefined}
                      helperText={passwordErr !== undefined ? passwordErr['password'] : ''}
                    />
                    <Grid container direction='row' justifyContent='center' alignItems='center' spacing={0}>
                      <Grid item>
                        <Button className={button} variant='contained' type='submit' disabled={loading}>
                          {loading && <CircularProgress color='inherit' size={20} className={progress} />}
                          Login
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions className={actions}>
                    <Grid
                      container
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                      spacing={0}
                    >
                      <Grid item>
                        <Link className={options} onClick={() => history.push('/forgot-password')}>
                          Forgot password?
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link className={options} onClick={() => history.push('/register')}>
                          Register
                        </Link>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </form>
            )}
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default Login;
