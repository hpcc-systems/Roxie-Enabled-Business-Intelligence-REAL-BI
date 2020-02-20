import React from 'react';
import { Provider } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

// Redux Store
import store from './store';

// Redux Actions
import { setUserFromToken } from './features/auth/actions';

// React Components
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard';

const token = localStorage.getItem('hpccDashboardToken');

// Check for existing token to log in user
if (token) {
  store.dispatch(setUserFromToken(token));
}

// Create custom app theme
const theme = createMuiTheme({
  palette: {
    primary: { main: '#ed1c24' },
    secondary: { main: '#666666' },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Dashboard />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
