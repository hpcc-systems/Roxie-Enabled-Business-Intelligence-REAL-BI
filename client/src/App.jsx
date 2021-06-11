import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

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
const theme = createMuiTheme({
  palette: {
    primary: { main: '#343a40' },
    secondary: { main: '#6c757d' },
    info: { main: '#007bff' }, // Blue buttons
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
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
              <PrivateRoute path='/workspace/:workspaceID?' component={Workspace} />
              <PrivateRoute exact path='/changepwd' component={ChangePwd} />
              <Route path='/' component={Login} />
            </Switch>
          </Router>
        )}
      </ThemeProvider>
    </Provider>
  );
};

export default App;
