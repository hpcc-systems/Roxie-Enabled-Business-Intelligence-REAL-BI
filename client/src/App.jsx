import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { unstable_createMuiStrictModeTheme } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';

// Redux Store
import store from './store';

// React Components
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Workspace from './components/Workspace';
import ChangePwd from './components/ChangePwd';
import Register from './components/Register';
import ForgotPwd from './components/ForgotPwd';
import ResetPwd from './components/ResetPwd';
import AzureLogin from './components/AzureLogin';

const { REACT_APP_AUTH_METHOD } = process.env;

// Create custom app theme
// Issue with MUI component, throws warning to console, this is walk around.
// https://github.com/mui-org/material-ui/issues/13394
const createTheme =
  process.env.NODE_ENV === 'production' ? createMuiTheme : unstable_createMuiStrictModeTheme;

const theme = createTheme({
  palette: {
    type: 'light', //dark
    primary: { main: '#343a40' },
    secondary: { main: '#6c757d' },
    info: { main: '#007bff' }, // Blue buttons
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*': {
          '&::-webkit-scrollbar': {
            width: '10px',
            height: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '40px',
            backgroundClip: 'content-box',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.4)',
            },
          },
        },
      },
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          {REACT_APP_AUTH_METHOD === 'ADFS' ? (
            <AzureLogin />
          ) : (
            <Router>
              <Switch>
                <Route exact path='/login' component={Login} />
                <Route exact path='/register/:shareID?' component={Register} />
                <Route exact path='/forgot-password' component={ForgotPwd} />
                <Route exact path='/reset-password/:resetUUID?' component={ResetPwd} />
                <PrivateRoute path='/workspace/:workspaceID?/:dashID?/:fileName?/' component={Workspace} />
                <PrivateRoute exact path='/changepwd' component={ChangePwd} />
                <Route path='/' component={Login} />
              </Switch>
            </Router>
          )}
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
