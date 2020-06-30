import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

// Redux Store
import store from './store';

// React Components
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard';

// Utils
import { checkForToken } from './utils/auth';
import setAuthHeader from './utils/axiosConfig';

// Constants
import { tokenName } from './constants';

// Create custom app theme
const theme = createMuiTheme({
  palette: {
    primary: { main: '#ed1c24' },
    secondary: { main: '#666666' },
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

const App = providedValues => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Router>
            <Header />
            <Switch>
              <Route
                path='/'
                render={props => {
                  return <Dashboard {...props} {...providedValues} />;
                }}
              />
            </Switch>
          </Router>
        </CssBaseline>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
