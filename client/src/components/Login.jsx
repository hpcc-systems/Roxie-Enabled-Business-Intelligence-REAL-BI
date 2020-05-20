import React from 'react';
import { useDispatch } from 'react-redux';
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

// Redux Actions
import { loginUser } from '../features/auth/actions';

// React Hooks
import useForm from '../hooks/useForm';

// Utils
import setAuthHeader from '../utils/axiosConfig';

// Constants
import { tokenName } from '../constants';

const useStyles = makeStyles(theme => ({
  grid: { minHeight: '50vh' },
  progress: { marginRight: 15 },
  textfield: { margin: `${theme.spacing(1)}px 0` },
}));

const initState = {
  username: '',
  password: '',
  loading: false,
};

const Login = () => {
  const { values: localState, handleChange } = useForm(initState);
  const { loading, password, username } = localState;
  const dispatch = useDispatch();
  const history = useHistory();
  const { grid, progress, textfield } = useStyles();

  const loginUserFn = async event => {
    event.preventDefault();

    // Enable loading animation
    handleChange(null, { name: 'loading', value: true });

    // Attempt to login user
    const { action, lastDashboard, token } = await loginUser(localState);

    // Send data to redux store
    dispatch(action);

    if (token) {
      // Set local storage and auth header
      localStorage.setItem(tokenName, token);
      setAuthHeader(token);

      // Generate new url and navigate there
      const location = lastDashboard ? `/dashboard/${lastDashboard}` : '/dashbaord';
      history.push(location);
    } else {
      handleChange(null, { name: 'loading', value: false });
    }
  };

  return (
    <Container maxWidth='xl'>
      <Grid container direction='column' justify='center' alignItems='center' className={grid} spacing={0}>
        <Grid item>
          <form onSubmit={loginUserFn}>
            <Card>
              <CardContent>
                <Typography variant='h6'>Login</Typography>
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
                    <Button variant='contained' color='primary' type='submit' disabled={loading}>
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
  );
};

export default Login;
