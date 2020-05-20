import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Redux actions
import { getLatestUserData } from '../features/auth/actions';

//Utils
import setAuthHeader from '../utils/axiosConfig';

// Constants
import { tokenName } from '../constants';

const PrivateRoute = ({ component, ...options }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useSelector(state => state.auth.user);
  const token = localStorage.getItem(tokenName);

  // No token present, return to Login page
  if (!token) {
    setAuthHeader();

    history.push('/login');
    return null;
  }

  // Token is present but user isn't loaded yet
  if (token && !id) {
    setAuthHeader(token);
    getLatestUserData().then(({ action }) => dispatch(action));
  }

  return <Route {...options} component={component} />;
};

export default PrivateRoute;
