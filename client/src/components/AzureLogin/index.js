import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { MsalProvider } from '@azure/msal-react';

import AzureLoginPage from './AzureLoginPage';
import WorkspaceAzureWrapper from './WorkspaceAzureWrapper';

import { msalInstance } from '../../index';

function AzureAppContainer() {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <Switch>
          <Route path='/workspace/:workspaceID?/:dashID?/:fileName?/' component={WorkspaceAzureWrapper} />
          <Route path='*' component={AzureLoginPage} />
        </Switch>
      </Router>
    </MsalProvider>
  );
}

export default AzureAppContainer;
