import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline } from '@material-ui/core';

// React Components
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard';

// Redux Store
import store from './store';

// Redux Actions
import { setUserFromToken } from './features/auth/actions';

const token = localStorage.getItem('hpccDashboardToken');

// Check for existing token to log in user
if (token) {
  const action = setUserFromToken(token);

  store.dispatch(action);
}

const App = () => {
  return (
    <Provider store={store}>
      <CssBaseline />
      <Header />
      <Dashboard />
    </Provider>
  );
};

export default App;
