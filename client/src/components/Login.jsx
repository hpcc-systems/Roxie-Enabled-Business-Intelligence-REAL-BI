import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';

// React Components
import Header from './Layout/Header';

// Redux Actions
import { getLatestUserData, loginUser } from '../features/auth/actions';

// React Hooks
import useForm from '../hooks/useForm';

// Utils
import { checkForToken } from '../utils/auth';
import setAuthHeader from '../utils/axiosConfig';

// Constants
import { tokenName } from '../constants';
import { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
  errMsg: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    margin: theme.spacing(2, 0, 2, 0),
  },
  grid: { minHeight: '50vh' },
  progress: { marginRight: theme.spacing(2) },
  textfield: { margin: theme.spacing(1, 0, 1, 0) },
}));

const initState = {
  username: '',
  password: '',
  loading: false,
};

const Login = () => {
  const { values: localState, handleChange } = useForm(initState);
  const { loading, password, username } = localState;
  const { msg: errorMsg } = useSelector(state => state.auth.errors);
  const dispatch = useDispatch();
  const history = useHistory();
  const { button, errMsg, grid, progress, textfield } = useStyles();

  useEffect(() => {
    const { token, valid } = checkForToken();

    if (token) {
      if (valid) {
        // There is a valid token in storage
        setAuthHeader(token);

        (async () => {
          const { action, lastWorkspace } = await getLatestUserData();

          // Send data to redux store
          dispatch(action);

          // Generate new url and navigate there
          const location = lastWorkspace ? `/workspace/${lastWorkspace}` : '/workspace';
          history.push(location);
        })();
      } else {
        // There is an invalid token in storage
        localStorage.removeItem(tokenName);
        setAuthHeader();
      }
    }
  });

  const loginUserFn = async event => {
    // Prevent page from reloading
    event.preventDefault();

    // Enable loading animation
    handleChange(null, { name: 'loading', value: true });

    // Attempt to login user
    const { action, lastWorkspace, token } = await loginUser(localState);

    // Send data to redux store
    dispatch(action);

    if (token) {
      // Set local storage and auth header
      localStorage.setItem(tokenName, token);
      setAuthHeader(token);

      // Generate new url and navigate there
      const location = lastWorkspace ? `/workspace/${lastWorkspace}` : '/workspace';
      history.push(location);
    } else {
      // No token means an error occured
      handleChange(null, { name: 'loading', value: false });
    }
  };

  return (
    <Fragment>
      <Header />
      <Container maxWidth='xl'>
        <Grid container direction='column' justify='center' alignItems='center' className={grid} spacing={0}>
          <Grid item>
            <form onSubmit={loginUserFn}>
              <Card>
                <CardContent>
                  <Typography variant='h6'>Login</Typography>
                  {errorMsg && errorMsg !== '' && (
                    <Typography className={errMsg} align='center'>
                      {errorMsg}
                    </Typography>
                  )}
                  <TextField
                    className={textfield}
                    label='Username'
                    name='username'
                    value={username}
                    onChange={handleChange}
                    fullWidth
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
                  />
                </CardContent>
                <CardActions>
                  <Grid container direction='row' justify='flex-end' alignItems='center' spacing={0}>
                    <Grid item>
                      <Button className={button} variant='contained' type='submit' disabled={loading}>
                        {loading && <CircularProgress color='inherit' size={20} className={progress} />}
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default Login;
