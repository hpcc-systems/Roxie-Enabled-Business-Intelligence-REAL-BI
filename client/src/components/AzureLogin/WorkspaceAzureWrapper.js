/* eslint-disable no-unused-vars */
import React from 'react';
import { InteractionType } from '@azure/msal-browser';
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Workspace from '../Workspace';
import { loginScopes } from './authConfig';
import { useHistory } from 'react-router';
import ErrorLoginComponent from './ErrorLoginComponent';

const WorkspaceAzureWrapper = props => {
  const { user } = useSelector(state => state.auth);
  const { accounts } = useMsal();
  const account = accounts[0] || null;
  const history = useHistory();

  useEffect(() => {
    if (account && !user.id) {
      history.push('/', { from: history.location.pathname });
    }
  }, [user, account]);

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={loginScopes}
      errorComponent={ErrorLoginComponent}
    >
      <Workspace {...props} />
    </MsalAuthenticationTemplate>
  );
};

export default WorkspaceAzureWrapper;
