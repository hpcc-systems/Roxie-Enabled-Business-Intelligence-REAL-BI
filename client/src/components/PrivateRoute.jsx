import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { batch, useDispatch, useSelector } from 'react-redux';

// Redux actions
import { getLatestUserData } from '../features/auth/actions';

//Utils
import setAuthHeader from '../utils/axiosConfig';

// Constants
import { tokenName } from '../constants';
import { getWorkspaces } from '../features/workspace/actions';

const PrivateRoute = ({ component, ...options }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { errorObj, user } = useSelector(state => state.auth);
  const token = localStorage.getItem(tokenName);
  const hasAuthError = Object.keys(errorObj).length > 0;

  if (!token) {
    setAuthHeader();

    history.push('/login');
    return null;
  }

  if (token && !user.id && !hasAuthError) {
    setAuthHeader(token);

    (async () => {
      const { action } = await getLatestUserData();
      const action2 = await getWorkspaces();

      // Send data to redux store
      batch(() => {
        dispatch(action);
        dispatch(action2);
      });
    })();
  }

  return <Route {...options} component={component} />;
};

export default PrivateRoute;
