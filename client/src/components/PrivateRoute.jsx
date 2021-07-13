import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { batch, useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux actions
import { getLatestUserData } from '../features/auth/actions';

//Utils
import setAuthHeader from '../utils/axiosConfig';

// Constants
import { tokenName } from '../constants';
import { getWorkspaces } from '../features/workspace/actions';
import { Box } from '@material-ui/core';

const PrivateRoute = ({ component, ...options }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { errorObj, user } = useSelector(state => state.auth);
  const token = localStorage.getItem(tokenName);
  const hasAuthError = Object.keys(errorObj).length > 0;

  if (!token) {
    setAuthHeader();
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: history.location.pathname },
        }}
      />
    );
  }

  React.useEffect(() => {
    if (token && !user.id && !hasAuthError) {
      setAuthHeader(token);

      (async () => {
        try {
          const { action } = await getLatestUserData();
          const action2 = await getWorkspaces();

          // Send data to redux store
          batch(() => {
            dispatch(action);
            dispatch(action2);
          });
        } catch (error) {
          history.push('/', { from: history.location.pathname });
        }
      })();
    }
  }, []);

  return user.id ? (
    <Route {...options} component={component} />
  ) : (
    <Box height='60vh' display='flex' justifyContent='center' alignItems='center'>
      <CircularProgress />
    </Box>
  );
};

export default PrivateRoute;
