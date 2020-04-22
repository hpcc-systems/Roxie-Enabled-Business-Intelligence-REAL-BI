import React from 'react';
import { useDispatch } from 'react-redux';
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
import { loginUser } from '../../features/auth/actions';

// Utils
import setAuthHeader from '../../utils/axiosConfig';

// React Hooks
import useForm from '../../hooks/useForm';

const useStyles = makeStyles(() => ({
  grid: { minHeight: '50vh' },
  progress: { marginRight: 15 },
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
  const { grid, progress } = useStyles();

  const loginUserFn = async () => {
    handleChange(null, { name: 'loading', value: true });

    loginUser().then(({ action, token }) => {
      setAuthHeader(token);
      dispatch(action);
    });
  };

  return (
    <Container>
      <Grid container direction='column' justify='center' alignItems='center' className={grid} spacing={0}>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant='h6'>Login</Typography>
              <TextField
                label='Username'
                name='username'
                value={username}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label='Password'
                name='password'
                type='password'
                value={password}
                onChange={handleChange}
                fullWidth
              />
            </CardContent>
            <CardActions>
              <Grid container direction='row' justify='flex-end' alignItems='center' spacing={0}>
                <Grid item>
                  <Button variant='contained' color='primary' onClick={loginUserFn} disabled={loading}>
                    {loading && <CircularProgress color='inherit' size={20} className={progress} />}
                    Login
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
