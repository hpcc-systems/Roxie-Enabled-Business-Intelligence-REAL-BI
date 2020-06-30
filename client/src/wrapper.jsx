import React from 'react';
import setAuthHeader from './utils/axiosConfig';
import { loginUser } from './features/auth/actions';
import App from './App';
import ReactDOM from 'react-dom';

const AuthLogin = async (username, password) => {
  const { action, lastDashboard, token } = await loginUser({ username, password });
  if (token) setAuthHeader(token);
  else console.log('Token empty ', token, lastDashboard);
  return action;
};

const RealBIApp = async (username, password, dashboardID) => {
  const action = await AuthLogin(username, password);

  const providedValues = {
    username: username,
    password: password,
    passedDashboardID: dashboardID,
    action: action,
  };
  ReactDOM.render(<App {...providedValues} />, document.getElementById('root'));
};
export default RealBIApp;
