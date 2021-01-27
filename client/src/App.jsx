import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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

// Utils
import { checkForToken } from './utils/auth';
import setAuthHeader from './utils/axiosConfig';

// Constants
import { tokenName } from './constants';

// Create custom app theme
const theme = createMuiTheme({
  palette: {
    primary: { main: '#343a40' },
    secondary: { main: '#6c757d' },
    info: { main: '#007bff' }, // Blue buttons
  },
});

const { token, valid } = checkForToken();

if (token) {
  if (valid) {
    // There is a valid token in storage
    setAuthHeader(token);
  } else {
    // There is an invalid token in storage
    localStorage.removeItem(tokenName);
    setAuthHeader();
  }
} else {
  // Confirm no auth header is set
  setAuthHeader();
}

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <CssBaseline />
          <Router>
            <Switch>
              <Route exact path='/' component={Login} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/register/:shareID?' component={Register} />
              <Route exact path='/forgot-password' component={ForgotPwd} />
              <Route exact path='/reset-password/:resetUUID?' component={ResetPwd} />
              <PrivateRoute path='/workspace/:workspaceID?' component={Workspace} />
              <PrivateRoute exact path='/changepwd' component={ChangePwd} />
            </Switch>
          </Router>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
